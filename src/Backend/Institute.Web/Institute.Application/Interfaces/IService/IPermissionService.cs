using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface IPermissionService
    {
        Task<IEnumerable<Permission>> GetAllAsync();
        Task<Permission?> GetByIdAsync(int id);
        Task CreateAsync(string name);
        Task DeleteAsync(int id);
    }
}

