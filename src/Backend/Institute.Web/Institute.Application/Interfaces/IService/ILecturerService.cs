using Institute.Application.DTOs;
using Institute.Infrastructure.DTOs;
using Microsoft.AspNetCore.Http;

namespace Institute.Application.Interfaces.IService
{
    public interface ILecturerService
    {
        Task<IEnumerable<LecturerResponseDto>> GetAllAsync();
        Task<LecturerResponseDto?> GetByIdAsync(int id);
        Task<LecturerResponseDto> CreateAsync(LecturerCreateUpdateDto dto);
        Task<LecturerResponseDto?> UpdateAsync(int id, LecturerCreateUpdateDto dto);
        Task<bool> DeleteAsync(int id);
        Task<string?> UploadPhotoAsync(int id, IFormFile photo, string uploadsFolder);
    }
}