using AutoMapper;
using Institute.API.DTOs;
using Institute.API.Helpers;
using Institute.Application.DTOs;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications.NewsSpec;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    [Authorize] // ✅ حماية كل الـ endpoints
    public class AdminNewsController : ControllerBase
    {
        private readonly IReadOnlyService<Dailynews> _newsService;
        private readonly IMapper _mapper;
        private readonly IRepository<Dailynews> _repo;
        private readonly INewsService _newsWriteService;

        public AdminNewsController(
            IReadOnlyService<Dailynews> newsService,
            IMapper mapper,
            IRepository<Dailynews> repo,
            INewsService newsWriteService)
        {
            _newsService = newsService;
            _mapper = mapper;
            _repo = repo;
            _newsWriteService = newsWriteService;
        }

        // ── GET ALL ─────────────────────────────
        [HttpGet("getAllNews")]
        public async Task<ActionResult<Pagination<NewsListDto>>> GetAllNews(
            [FromQuery] NewsSpecParams newsParams)
        {
            var spec = new AdminNewsWithMainPicSpec(newsParams);
            var news = await _repo.GetAllWithSpecAsync(spec);

            var data = news.Select(x => new NewsListDto
            {
                Id = x.NewsId,
                Title = x.ATitel,
                PublishedAt = x.NewsDate ?? DateTime.UtcNow,
                ImageUrl = BuildImageUrl(
                    x.NewsPics?
                     .OrderBy(p => p.PicPeriorty)
                     .FirstOrDefault()?.ImageName)
            }).ToList();

            var countSpec = new NewsWithFiltersForCountSpec(newsParams);
            var count = await _repo.GetCountAsync(countSpec);

            return Ok(new Pagination<NewsListDto>(
                newsParams.PageIndex,
                newsParams.PageSize,
                count,
                data));
        }

        // ── GET BY ID ───────────────────────────
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNewsById(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid news id" });

            var spec = new NewsWithDetailsSpec(id);
            var news = await _newsService.GetEntityWithSpec(spec);

            if (news == null)
                return NotFound(new { message = "الخبر غير موجود" });

            return Ok(new NewsDetailsDto
            {
                Id = news.NewsId,
                Title = news.ATitel,
                Details = news.ADetails,
                PublishedAt = news.NewsDate ?? DateTime.UtcNow,

                // الصورة الرئيسية
                ImageUrl = BuildImageUrl(
                    news.NewsPics?
                        .OrderBy(p => p.PicPeriorty)
                        .FirstOrDefault()?.ImageName),

                // ✅ كل الصور مع PicId علشان الـ frontend يعرف يبعت الصح في الـ delete
                Images = news.NewsPics?
                    .OrderBy(p => p.PicPeriorty)
                    .Select(p => new NewsImageDto
                    {
                        PicId = p.PicId,
                        ImageUrl = BuildImageUrl(p.ImageName),
                        IsMain = p.StartUpPic ?? false
                    })
                    .ToList()
            });
        }

        // ── CREATE ───────────────────────────────
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] NewsCreateUpdateDto dto)
        {
            var result = await _newsWriteService.CreateAsync(dto);

            result.ImageUrl = BuildImageUrl(result.ImageUrl);
            result.ImageUrls = result.ImageUrls?.Select(u => BuildImageUrl(u)).ToList();

            return CreatedAtAction(
                nameof(GetNewsById),
                new { id = result.Id },
                result);
        }

        // ── UPDATE ───────────────────────────────
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] NewsCreateUpdateDto dto)
        {
            var result = await _newsWriteService.UpdateAsync(id, dto);

            if (result == null)
                return NotFound(new { message = "الخبر غير موجود" });

            result.ImageUrl = BuildImageUrl(result.ImageUrl);
            result.ImageUrls = result.ImageUrls?.Select(u => BuildImageUrl(u)).ToList();

            return Ok(result);
        }

        // ── DELETE NEWS ───────────────────────────
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid id" });

            var result = await _newsWriteService.DeleteAsync(id);

            if (!result)
                return NotFound(new { message = "الخبر غير موجود" });

            return Ok(new { message = "تم حذف الخبر بنجاح" });
        }

        // ── DELETE SINGLE IMAGE ───────────────────
        [HttpDelete("{newsId}/images/{picId}")]
        public async Task<IActionResult> DeleteImage(int newsId, int picId)
        {
            if (newsId <= 0 || picId <= 0)
                return BadRequest(new { message = "Invalid id" });

            var result = await _newsWriteService.DeleteImageAsync(newsId, picId);

            if (!result)
                return NotFound(new { message = "الصورة غير موجودة أو لا تنتمي لهذا الخبر" });

            return Ok(new { message = "تم حذف الصورة بنجاح" });
        }

        // ── BUILD URL ────────────────────────────
        private string? BuildImageUrl(string? blobName)
        {
            if (string.IsNullOrWhiteSpace(blobName))
                return null;

            return $"https://acwebappbackup.blob.core.windows.net/icemt/news/{blobName}";
        }
    }
}