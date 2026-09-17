using Institute.API.DTOs;
using Institute.Application.DTOs;

namespace Institute.Application.Interfaces.IService
{
    public interface INewsService
    {
        Task<NewsCreateUpdateDto> CreateAsync(NewsCreateUpdateDto dto);
        Task<NewsCreateUpdateDto?> UpdateAsync(int id, NewsCreateUpdateDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> DeleteImageAsync(int newsId, int picId);
    }
}