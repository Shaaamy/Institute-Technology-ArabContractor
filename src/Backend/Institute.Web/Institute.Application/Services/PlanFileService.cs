using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications.AdminSpec.Planfiles;
using Microsoft.Extensions.Configuration;

namespace Institute.Application.Services
{
    public class PlanFileService : IPlanFileService
    {
        private readonly IRepository<PlanFile> _planFileRepo;
        private readonly IBlobStorage _blobStorage;
        private readonly IConfiguration _config;

        private const string Container = "icemt";
        private const string Folder = "planfiles";

        public PlanFileService(
            IRepository<PlanFile> planFileRepo,
            IBlobStorage blobStorage,
            IConfiguration config)
        {
            _planFileRepo = planFileRepo;
            _blobStorage = blobStorage;
            _config = config;
        }

        // ── GET FILES ───────────────────────────────
        public async Task<IEnumerable<PlanFileDto>> GetFilesAsync(int planId)
        {
            var spec = new PlanFilesByPlanIdSpec(planId);

            var files = await _planFileRepo.GetAllWithSpecAsync(spec);

            return files.Select(x => new PlanFileDto
            {
                PlanId = x.PlanId,
                FileId = x.FileId,
                FileTitle = x.FileTitle,
                FilePeriorty = x.FilePeriorty,

                // ✅ يرجع URL كامل
                FileName = BuildFileUrl(x.FileName)
            });
        }

        // ── ADD ─────────────────────────────────────
        public async Task AddAsync(CreatePlanFileDto dto)
        {
            var spec = new PlanFilesByPlanIdSpec(dto.PlanId);

            var existingFiles =
                await _planFileRepo.GetAllWithSpecAsync(spec);

            int nextFileId = existingFiles.Any()
                ? existingFiles.Max(x => x.FileId) + 1
                : 1;

            // ✅ Upload To Azure Blob
            var uploadedFileName = await _blobStorage.UploadFileAsync(
                dto.File,
                Container,
                Folder);

            var planFile = new PlanFile
            {
                PlanId = dto.PlanId,
                FileId = nextFileId,
                FileTitle = dto.FileTitle,
                FilePeriorty = dto.FilePeriorty,

                // ✅ اسم الملف فقط
                FileName = uploadedFileName
            };

            await _planFileRepo.AddAsync(planFile);

            await _planFileRepo.SaveChangesAsync();
        }

        // ── DELETE ──────────────────────────────────
        public async Task DeleteAsync(int planId, int fileId)
        {
            var spec = new PlanFileByIdSpec(planId, fileId);

            var file =
                await _planFileRepo.GetByIdWithSpecAsync(spec);

            if (file == null)
                throw new Exception("File not found");

            _planFileRepo.Delete(file);

            await _planFileRepo.SaveChangesAsync();
        }

        // ── BUILD FILE URL ──────────────────────────
        private string? BuildFileUrl(string? fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName))
                return null;

            var baseUrl = _config["AzureStorage:BaseUrl"];

            return $"{baseUrl?.TrimEnd('/')}/planfiles/{fileName}";
        }
    }
}