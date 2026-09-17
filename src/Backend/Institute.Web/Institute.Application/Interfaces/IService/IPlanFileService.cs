using Institute.Application.DTOs.AdminDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface IPlanFileService
    {
        Task<IEnumerable<PlanFileDto>> GetFilesAsync(int planId);

        Task AddAsync(CreatePlanFileDto dto);

        Task DeleteAsync(int planId, int fileId);
    }
}
