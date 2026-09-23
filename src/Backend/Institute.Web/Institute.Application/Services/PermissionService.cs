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
    public class PermissionService : IPermissionService
    {
        private readonly IRepository<Permission> _permissionRepo;

        public PermissionService(IRepository<Permission> permissionRepo)
        {
            _permissionRepo = permissionRepo;
        }

        public async Task<IEnumerable<Permission>> GetAllAsync()
        {
            return await _permissionRepo.GetAllAsync();
        }

        public async Task<Permission?> GetByIdAsync(int id)
        {
            return await _permissionRepo.GetByIdAsync(id);
        }
    }
}
