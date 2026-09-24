using System.Collections.Generic;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface IUserPermissionService
    {
        Task AssignAsync(int userId, int permissionId);

        Task RemoveAsync(int userId, int permissionId);

        Task<List<string>> GetUserPermissionsAsync(int userId);

        Task<List<string>> GetPermissionsByClerkId(string clerkId);

        Task<(bool IsManager, List<string> Permissions)> GetMyRoleAsync(string clerkId);
    }
}