using AutoMapper;
using Institute.API.DTOs;
using Institute.Domain.Entities;
using Microsoft.Extensions.Configuration;

namespace Institute.API.Helpers
{
    /// <summary>
    /// يرجع كل URLs صور الخبر مرتبة حسب PicPeriorty
    /// يُستخدم لـ ImageUrls (List) في NewsDetailsDto
    /// </summary>
    public class NewsPictureUrlsResolver
        : IValueResolver<Dailynews, NewsDetailsDto, List<string>>
    {
        private readonly IConfiguration _configuration;

        public NewsPictureUrlsResolver(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public List<string> Resolve(
            Dailynews source,
            NewsDetailsDto destination,
            List<string> destMember,
            ResolutionContext context)
        {
            return source.NewsPics
                .OrderBy(p => p.PicPeriorty)
                .Where(p => !string.IsNullOrEmpty(p.ImageName))
                .Select(p => $"{_configuration["ApiUrl"]}/images/news/{p.ImageName}")
                .ToList();
        }
    }
}