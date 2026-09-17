using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class BooksTypeService : IBooksTypeService
    {
        private readonly IRepository<BooksType> _repo;

        public BooksTypeService(IRepository<BooksType> repo)
        {
            _repo = repo;
        }

        public async Task<BooksTypeDto> CreateAsync(CreateBooksTypeDto dto)
        {
            var type = new BooksType
            {
                TypeName = dto.TypeName
            };

            await _repo.AddAsync(type);
            await _repo.SaveChangesAsync();

            return new BooksTypeDto
            {
                TypeId = type.TypeId,
                TypeName = type.TypeName
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var type = await _repo.GetByIdAsync(id);

            if (type == null)
                return false;

            _repo.Delete(type);
            await _repo.SaveChangesAsync();

            return true;
        }

        public async Task<List<BooksTypeDto>> GetAllAsync()
        {
            var types = await _repo.GetAllAsync();

            return types.Select(t => new BooksTypeDto
            {
                TypeId = t.TypeId,
                TypeName = t.TypeName
            }).ToList();
        }

        public async Task<BooksTypeDto?> GetByIdAsync(int id)
        {
            var type = await _repo.GetByIdAsync(id);

            if (type == null) return null;

            return new BooksTypeDto
            {
                TypeId = type.TypeId,
                TypeName = type.TypeName
            };
        }


        public async Task<bool> UpdateAsync(int id, UpdateBooksTypeDto dto)
        {
            var type = await _repo.GetByIdAsync(id);

            if (type == null)
                return false;

            type.TypeName = dto.TypeName;

            _repo.Update(type);
            await _repo.SaveChangesAsync();

            return true;
        }
    }
}
