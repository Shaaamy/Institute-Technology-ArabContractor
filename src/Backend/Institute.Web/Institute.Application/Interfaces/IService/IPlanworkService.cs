using Institute.Application.DTOs;
using Institute.Application.DTOs.AdminDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface IPlanworkService
    {
        Task<List<CategoryTreeDto>> GetTreeForAdminAsync();
        Task<PlanworkDto?> GetByIdAsync(int id);
        Task CreateAsync(CreatePlanworkDto dto);
        Task<bool> UpdateAsync(int id, CreatePlanworkDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
