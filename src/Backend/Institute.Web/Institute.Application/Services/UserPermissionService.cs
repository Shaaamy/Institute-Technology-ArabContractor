using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications.PermissionsSpec;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class UserPermissionService : IUserPermissionService
    {
        private readonly IRepository<UserPermission> _userPermissionsRepo;
        private readonly IRepository<AppUser> _appUserRepo;

        public UserPermissionService(
            IRepository<UserPermission> userPermissionsRepo,
            IRepository<AppUser> appUserRepo)
        {
            _userPermissionsRepo = userPermissionsRepo;
            _appUserRepo = appUserRepo;
        }

        public async Task AssignAsync(int userId, int permissionId)
        {
            var user = await _appUserRepo.GetByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            var exists = await _userPermissionsRepo.AnyAsync(
                x => x.AppUserId == userId &&
                     x.PermissionId == permissionId);

            if (!exists)
            {
                var userPermission = new UserPermission
                {
                    AppUserId = userId,
                    PermissionId = permissionId
                };

                await _userPermissionsRepo.AddAsync(userPermission);
            }

            // User has at least one admin permission
            user.IsAdmin = true;

            await _userPermissionsRepo.SaveChangesAsync();
        }

        public async Task RemoveAsync(int userId, int permissionId)
        {
            var spec = new UserPermissionByUserAndPermissionSpec(
                userId,
                permissionId);

            var entity = (await _userPermissionsRepo.ListAsync(spec))
                .FirstOrDefault();

            if (entity == null)
                return;

            _userPermissionsRepo.Delete(entity);

            // Check if the user still has other permissions
            var hasOtherPermissions = await _userPermissionsRepo.AnyAsync(
                x => x.AppUserId == userId &&
                     x.PermissionId != permissionId);

            var user = await _appUserRepo.GetByIdAsync(userId);

            if (user != null)
            {
                user.IsAdmin = hasOtherPermissions;
            }

            await _userPermissionsRepo.SaveChangesAsync();
        }

        public async Task<List<string>> GetUserPermissionsAsync(int userId)
        {
            var spec = new UserPermissionsSpec(userId);

            var result = await _userPermissionsRepo.ListAsync(spec);

            return result
                .Where(x => x.Permission != null)
                .Select(x => x.Permission.Name)
                .ToList();
        }

        public async Task<List<string>> GetPermissionsByClerkId(
            string clerkId)
        {
            var user = await _appUserRepo.GetByClerkIdAsync(clerkId);

            if (user == null)
                return new List<string>();

            var spec = new UserPermissionsSpec(user.Id);

            var userPermissions =
                await _userPermissionsRepo.GetAllWithSpecAsync(spec);

            return userPermissions
                .Where(x => x.Permission != null)
                .Select(x => x.Permission.Name)
                .ToList();
        }

        // ── New: powers GET /api/UserPermissions/me ──
        public async Task<(bool IsManager, List<string> Permissions)> GetMyRoleAsync(
            string clerkId)
        {
            var user = await _appUserRepo.GetByClerkIdAsync(clerkId);

            if (user == null)
                return (false, new List<string>());

            // ⚠️ Verify AppUser.IsManager is the real property name.
            if (user.IsManager)
                return (true, new List<string>());

            var spec = new UserPermissionsSpec(user.Id);

            var userPermissions =
                await _userPermissionsRepo.GetAllWithSpecAsync(spec);

            var names = userPermissions
                .Where(x => x.Permission != null)
                .Select(x => x.Permission.Name)
                .ToList();

            return (false, names);
        }
    }
}