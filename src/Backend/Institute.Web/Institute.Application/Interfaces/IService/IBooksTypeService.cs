using Institute.Application.DTOs.AdminDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface IBooksTypeService
    {
        Task<List<BooksTypeDto>> GetAllAsync();
        Task<BooksTypeDto?> GetByIdAsync(int id);
        Task<BooksTypeDto> CreateAsync(CreateBooksTypeDto dto);
        Task<bool> UpdateAsync(int id, UpdateBooksTypeDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
