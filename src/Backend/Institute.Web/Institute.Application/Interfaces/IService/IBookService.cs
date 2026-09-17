using Institute.Application.DTOs.AdminDtos;
using Institute.Domain.Entities;
using Institute.Domain.specifications.BookSpec;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface IBookService
    {
        //Task<BookDto> GetAllAsync(BookSpecParams param);
        Task<BookDto?> GetByIdAsync(int id);
        Task<BookDto> CreateAsync(CreateBookDto dto);
        Task<bool> UpdateAsync(int id, UpdateBookDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
