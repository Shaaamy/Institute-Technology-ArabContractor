using Institute.Application.DTOs;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Institute.Application.Services
{
    public class NewsService : INewsService
    {
        private readonly IRepository<Dailynews> _newsRepo;
        private readonly IRepository<NewsPic> _picRepo;
        private readonly IBlobStorage _blobStorage;
        private readonly IConfiguration _config;

        private const string Container = "icemt";
        private const string Folder = "news";

        public NewsService(
            IRepository<Dailynews> newsRepo,
            IRepository<NewsPic> picRepo,
            IBlobStorage blobStorage,
            IConfiguration config)
        {
            _newsRepo = newsRepo;
            _picRepo = picRepo;
            _blobStorage = blobStorage;
            _config = config;
        }

        // ── CREATE ───────────────────────────────
        public async Task<NewsCreateUpdateDto> CreateAsync(NewsCreateUpdateDto dto)
        {
            var entity = new Dailynews
            {
                ATitel = dto.Title,
                ADetails = dto.Details,
                NewsDate = dto.Date,
                Approved = true,
                ShowFlag = dto.ShowFlag
            };

            await _newsRepo.AddAsync(entity);
            await _newsRepo.SaveChangesAsync();

            if (dto.Images != null && dto.Images.Any())
                await UploadAndSavePicsAsync(entity.NewsId, dto.Images);

            var blobNames = await GetExistingBlobNames(entity.NewsId);

            return ToDto(entity, blobNames);
        }

        // ── UPDATE ───────────────────────────────
        public async Task<NewsCreateUpdateDto?> UpdateAsync(int id, NewsCreateUpdateDto dto)
        {
            var entity = await _newsRepo.GetByIdAsync(id);
            if (entity == null) return null;

            entity.ATitel = dto.Title;
            entity.ADetails = dto.Details;
            entity.NewsDate = dto.Date;
            entity.ShowFlag = dto.ShowFlag;
            _newsRepo.Update(entity);
            await _newsRepo.SaveChangesAsync();

            if (dto.Images != null && dto.Images.Any())
            {
                var lastPriority = (await _picRepo.GetAllAsync())
                    .Where(p => p.NewsId == id)
                    .OrderByDescending(p => p.PicPeriorty)
                    .FirstOrDefault()?.PicPeriorty ?? 0;

                await UploadAndSavePicsAsync(entity.NewsId, dto.Images, lastPriority);
            }

            var blobNames = await GetExistingBlobNames(entity.NewsId);

            return ToDto(entity, blobNames);
        }

        // ── DELETE NEWS ───────────────────────────
        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _newsRepo.GetByIdAsync(id);
            if (entity == null) return false;

            var pics = (await _picRepo.GetAllAsync())
                .Where(p => p.NewsId == id)
                .ToList();

            // امسح كل الصور من Azure أولاً
            foreach (var pic in pics)
            {
                if (!string.IsNullOrWhiteSpace(pic.ImageName))
                    await _blobStorage.DeleteFileAsync(pic.ImageName, Container, Folder);

                _picRepo.Delete(pic);
            }

            if (pics.Any())
                await _picRepo.SaveChangesAsync();

            _newsRepo.Delete(entity);
            await _newsRepo.SaveChangesAsync();

            return true;
        }

        // ── DELETE SINGLE IMAGE ───────────────────
        public async Task<bool> DeleteImageAsync(int newsId, int picId)
        {
            // تأكد إن الصورة موجودة وتابعة لنفس الخبر
            var pic = (await _picRepo.GetAllAsync())
                .FirstOrDefault(p => p.PicId == picId && p.NewsId == newsId);

            if (pic == null) return false;

            // امسح من Azure Blob Storage
            if (!string.IsNullOrWhiteSpace(pic.ImageName))
                await _blobStorage.DeleteFileAsync(pic.ImageName, Container, Folder);

            // امسح من الـ DB
            _picRepo.Delete(pic);
            await _picRepo.SaveChangesAsync();

            // ✅ أعد ترتيب الـ Priority للصور الباقية
            var remaining = (await _picRepo.GetAllAsync())
                .Where(p => p.NewsId == newsId)
                .OrderBy(p => p.PicPeriorty)
                .ToList();

            for (int i = 0; i < remaining.Count; i++)
            {
                remaining[i].PicPeriorty = i + 1;
                remaining[i].StartUpPic = (i == 0); // الأولى دايماً هي الرئيسية
                _picRepo.Update(remaining[i]);
            }

            if (remaining.Any())
                await _picRepo.SaveChangesAsync();

            return true;
        }

        // ── UPLOAD MULTIPLE IMAGES ────────────────
        private async Task UploadAndSavePicsAsync(
            int newsId,
            List<IFormFile> images,
            int startPriority = 0)
        {
            int priority = startPriority + 1;

            foreach (var image in images)
            {
                var blobPath = await _blobStorage.UploadFileAsync(image, Container, Folder);
                var fileName = Path.GetFileName(blobPath);

                await _picRepo.AddAsync(new NewsPic
                {
                    NewsId = newsId,
                    ImageName = fileName,
                    StartUpPic = priority == 1,
                    PicPeriorty = priority++
                });
            }

            await _picRepo.SaveChangesAsync();
        }

        // ── GET ALL EXISTING BLOB NAMES ───────────
        private async Task<List<string?>> GetExistingBlobNames(int newsId)
        {
            return (await _picRepo.GetAllAsync())
                .Where(p => p.NewsId == newsId)
                .OrderBy(p => p.PicPeriorty)
                .Select(p => p.ImageName)
                .ToList();
        }

        // ── GET URL ───────────────────────────────
        private string? GetImageUrl(string? blobName)
        {
            if (string.IsNullOrWhiteSpace(blobName))
                return null;

            var baseUrl = _config["AzureStorage:BaseUrl"];
            return $"{baseUrl?.TrimEnd('/')}/news/{blobName.TrimStart('/')}";
        }

        // ── TO DTO ────────────────────────────────
        private NewsCreateUpdateDto ToDto(
            Dailynews entity,
            List<string?> blobNames)
        {
            return new NewsCreateUpdateDto
            {
                Id = entity.NewsId,
                Title = entity.ATitel,
                Details = entity.ADetails,
                Date = entity.NewsDate ?? DateTime.UtcNow,
                ImageUrl = blobNames.FirstOrDefault(),
                ImageUrls = blobNames,
                ShowFlag = entity.ShowFlag
            };
        }
    }
}