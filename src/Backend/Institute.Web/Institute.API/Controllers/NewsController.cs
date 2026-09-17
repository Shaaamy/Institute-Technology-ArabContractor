using AutoMapper;
using Institute.API.DTOs;
using Institute.API.Helpers;
using Institute.Application.DTOs;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications.NewsSpec;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly IReadOnlyService<Dailynews> _newsService;
        private readonly IMapper _mapper;
        private readonly IRepository<Dailynews> _repo;
        private readonly INewsService _newsWriteService;

        public NewsController(
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

        // ── GET ALL ───────────────────────────────────────────────────
        [HttpGet("getAllNews")]
        public async Task<ActionResult<Pagination<NewsListDto>>> GetAllNews(
            [FromQuery] NewsSpecParams newsParams)
        {
            var spec = new NewsWithMainPicSpec(newsParams);
            var news = await _repo.GetAllWithSpecAsync(spec);

            // ✅ بدل الـ mapper — بنبني يدوياً عشان نضيف ImageUrls
            var data = news.Select(x => new NewsListDto
            {
                Id = x.NewsId,
                Title = x.ATitel,
                PublishedAt = x.NewsDate ?? DateTime.UtcNow,
                ImageUrl = BuildImageUrl(
                    x.NewsPics?
                    .OrderBy(p => p.PicPeriorty)
                    .FirstOrDefault()?.ImageName),

                // ✅ زيادة — كل الصور
                ImageUrls = x.NewsPics?
                    .OrderBy(p => p.PicPeriorty)
                    .Select(p => BuildImageUrl(p.ImageName))
                    .ToList()
            }).ToList();

            var countSpec = new NewsWithFiltersForCountSpec(newsParams);
            var count = await _repo.GetCountAsync(countSpec);

            return Ok(new Pagination<NewsListDto>(
                newsParams.PageIndex, newsParams.PageSize, count, data));
        }

        // ── GET BY ID ─────────────────────────────────────────────────
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNewsById(int id)
        {
            if (id <= 0) return BadRequest("Invalid news id");

            var spec = new NewsWithDetailsSpec(id);
            var news = await _newsService.GetEntityWithSpec(spec);

            if (news == null) return NotFound();

            var dto = _mapper.Map<NewsDetailsDto>(news);

            // ✅ زيادة — كل الصور
            dto.ImageUrls = news.NewsPics?
                .OrderBy(p => p.PicPeriorty)
                .Select(p => BuildImageUrl(p.ImageName))
                .ToList();

            return Ok(dto);
        }
        // ── GET YEARS ─────────────────────────────────────────────────
        //[HttpGet("years")]
        //public async Task<ActionResult<IEnumerable<int>>> GetNewsYears()
        //{
        //    var spec = new NewsWithMainPicSpec(new NewsSpecParams { PageSize = int.MaxValue, PageIndex = 1 });
        //    var news = await _repo.GetAllWithSpecAsync(spec);

        //    var years = news
        //        .Where(x => x.NewsDate.HasValue)
        //        .Select(x => x.NewsDate!.Value.Year)
        //        .Distinct()
        //        .OrderByDescending(y => y)
        //        .ToList();

        //    return Ok(years);
        //}
        [HttpGet("years")]
        public async Task<ActionResult<IEnumerable<int>>> GetNewsYears()
        {
            var news = await _repo.GetAllAsync();

            var years = news
                .Where(x => x.NewsDate.HasValue)
                .Select(x => x.NewsDate.Value.Year)
                .Distinct()
                .OrderByDescending(x => x)
                .ToList();

            return Ok(years);
        }
        // ── BUILD URL ─────────────────────────────────────────────────
        private string? BuildImageUrl(string? blobName)
        {
            if (string.IsNullOrWhiteSpace(blobName))
                return null;

            return $"https://acwebappbackup.blob.core.windows.net/icemt/news/{blobName}";
        }
    }
}