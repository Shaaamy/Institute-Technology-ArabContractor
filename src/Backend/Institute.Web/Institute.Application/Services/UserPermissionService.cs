using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications.PermissionsSpec;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class UserPermissionService : IUserPermissionService
    {
        private readonly IRepository<UserPermission> _userpermissionsRepo;

        public UserPermissionService(IRepository<UserPermission> userpermissionsRepo)
        {
            _userpermissionsRepo = userpermissionsRepo;
        }

        public async Task AssignAsync(int userId, int permissionId)
        {
            var exists = await _userpermissionsRepo
                .AnyAsync(x => x.AppUserId == userId && x.PermissionId == permissionId);

            if (exists)
                return;

            var userPermission = new UserPermission
            {
                AppUserId = userId,
                PermissionId = permissionId
            };

            await _userpermissionsRepo.AddAsync(userPermission);
            await _userpermissionsRepo.SaveChangesAsync();
        }

        public async Task RemoveAsync(int userId, int permissionId)
        {
            var spec = new UserPermissionByUserAndPermissionSpec(userId, permissionId);

            var entity = (await _userpermissionsRepo.ListAsync(spec))
                .FirstOrDefault();

            if (entity == null)
                return;

            _userpermissionsRepo.Delete(entity);
            await _userpermissionsRepo.SaveChangesAsync();
        }

        public async Task<List<string>> GetUserPermissionsAsync(int userId)
        {
            var spec = new UserPermissionsSpec(userId);

            var result = await _userpermissionsRepo.ListAsync(spec);

            return result
                .Select(x => x.Permission.Name)
                .ToList();
        }

        //public async Task<List<string>> GetPermissionsByClerkId(string clerkId)
        //{
        //    // ✅ 1. هات اليوزر من UserRepo مش UserPermissionRepo
        //    var user = await _userpermissionsRepo.GetByClerkIdAsync(clerkId);

        //    if (user == null)
        //        return new List<string>();

        //    // ✅ 2. هات كل اليوزر بيرميشن
        //    var all = await _userpermissionsRepo.GetAllAsync();

        //    // ⚠️ لو مفيش Include → Permission ممكن تبقى null
        //    var result = all
        //        .Where(x => x.Id == user.Id)
        //        .Where(x => x.Permission != null)
        //        .Select(x => x.Permission.Name)
        //        .ToList();

        //    return result;
        //}

        public async Task<List<string>> GetPermissionsByClerkId(string clerkId)
        {
            var user = await _userpermissionsRepo.GetByClerkIdAsync(clerkId);

            if (user == null)
                return new List<string>();

            var spec = new UserPermissionsSpec(user.Id);

            var userPermissions = await _userpermissionsRepo.GetAllWithSpecAsync(spec);

            return userPermissions
                .Select(x => x.Permission.Name)
                .ToList();
        }
    }
}
