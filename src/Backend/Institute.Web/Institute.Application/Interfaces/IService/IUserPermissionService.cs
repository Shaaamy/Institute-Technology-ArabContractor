using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface IUserPermissionService
    {
        Task AssignAsync(int userId, int permissionId);
        Task RemoveAsync(int userId, int permissionId);
        Task<List<string>> GetUserPermissionsAsync(int userId);
        Task<List<string>> GetPermissionsByClerkId(string clerkId);
    }
}
