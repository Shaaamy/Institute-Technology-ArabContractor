using AutoMapper;
using AutoMapper.Execution;
using Institute.API.DTOs;
using Institute.Domain.Entities;
using Microsoft.Extensions.Configuration;


namespace Institute.API.Helpers
{
    public class NewsPictureUrlResolver<TDestination>
     : IValueResolver<Dailynews, TDestination, string?>
    {
        private readonly IConfiguration _configuration;

        public NewsPictureUrlResolver(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string? Resolve(
            Dailynews source,
            TDestination destination,
            string? destMember,
            ResolutionContext context)
        {
            var imageName = source.NewsPics
                .OrderBy(p => p.PicPeriorty)
                .Select(p => p.ImageName)
                .FirstOrDefault();

            if (string.IsNullOrEmpty(imageName))
                return null;

            return $"{_configuration["AzureStorage:BaseUrl"]}/news/{imageName}";
        }
    }

}
