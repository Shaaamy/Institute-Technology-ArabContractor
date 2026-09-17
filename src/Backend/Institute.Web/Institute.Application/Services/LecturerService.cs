using Institute.Application.DTOs;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Infrastructure.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Institute.Application.Services
{
    public class LecturerService : ILecturerService
    {
        private readonly IRepository<Lecturer> _repo;
        private readonly IBlobStorage _blobStorage;
        private readonly IConfiguration _config;

        private const string Container = "icemt";
        private const string Folder = "lecturers";

        public LecturerService(
            IRepository<Lecturer> repo,
            IBlobStorage blobStorage,
            IConfiguration config)
        {
            _repo = repo;
            _blobStorage = blobStorage;
            _config = config;
        }

        // ── Mapping helper ────────────────────────────────────────────────────
        private LecturerResponseDto ToDto(Lecturer l) => new()
        {
            Id = l.LecturerId,
            Name = l.LecturerName,
            Pic = GetImageUrl(l.LecturerPic),
            Course = l.LecturerCourse,
            MainEdu = l.LecturerMainEdu,
            Edu = l.LecturerEdu,
            Details = l.LecturerDetails,
            Telephone = l.Telephone,
            Email = l.Email
        };

        // ── GET ALL ───────────────────────────────────────────────────────────
        public async Task<IEnumerable<LecturerResponseDto>> GetAllAsync()
        {
            var lecturers = await _repo.GetAllAsync();
            return lecturers.Select(ToDto);
        }

        // ── GET BY ID ─────────────────────────────────────────────────────────
        public async Task<LecturerResponseDto?> GetByIdAsync(int id)
        {
            var lecturer = await _repo.GetByIdAsync(id);

            if (lecturer == null)
                return null;

            return ToDto(lecturer);
        }

        // ── CREATE ────────────────────────────────────────────────────────────
        public async Task<LecturerResponseDto> CreateAsync(LecturerCreateUpdateDto dto)
        {
            var entity = new Lecturer
            {
                LecturerName = dto.Name,
                LecturerMainEdu = dto.Specialty,
                LecturerCourse = dto.Courses,
                LecturerEdu = dto.Level,
                LecturerDetails = dto.Details,
                Telephone = dto.Phone,
                Email = dto.Email
            };

            await _repo.AddAsync(entity);
            await _repo.SaveChangesAsync();

            return ToDto(entity);
        }

        // ── UPDATE ────────────────────────────────────────────────────────────
        public async Task<LecturerResponseDto?> UpdateAsync(int id, LecturerCreateUpdateDto dto)
        {
            var entity = await _repo.GetByIdAsync(id);

            if (entity == null)
                return null;

            entity.LecturerName = dto.Name;
            entity.LecturerMainEdu = dto.Specialty;
            entity.LecturerCourse = dto.Courses;
            entity.LecturerEdu = dto.Level;
            entity.LecturerDetails = dto.Details;
            entity.Telephone = dto.Phone;
            entity.Email = dto.Email;

            _repo.Update(entity);
            await _repo.SaveChangesAsync();

            return ToDto(entity);
        }

        // ── DELETE ────────────────────────────────────────────────────────────
        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _repo.GetByIdAsync(id);

            if (entity == null)
                return false;

            _repo.Delete(entity);
            await _repo.SaveChangesAsync();

            return true;
        }

        // ── UPLOAD PHOTO ──────────────────────────────────────────────────────
        public async Task<string?> UploadPhotoAsync(int id, IFormFile photo, string uploadsFolder)
        {
            var entity = await _repo.GetByIdAsync(id);

            if (entity == null)
                return null;

            // Upload to Azure Blob
            var fullBlobPath = await _blobStorage.UploadFileAsync(
                photo,
                Container,
                Folder);

            // Save file name only
            var fileNameOnly = Path.GetFileName(fullBlobPath);

            entity.LecturerPic = fileNameOnly;

            _repo.Update(entity);
            await _repo.SaveChangesAsync();

            return GetImageUrl(fileNameOnly);
        }

        // ── BUILD IMAGE URL ───────────────────────────────────────────────────
        private string? GetImageUrl(string? fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName))
                return null;

            var baseUrl = _config["AzureStorage:BaseUrl"];

            return $"{baseUrl?.TrimEnd('/')}/lecturers/{fileName}";
        }
    }
}