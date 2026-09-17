using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.PermissionsSpec
{
    public class UserPermissionByUserAndPermissionSpec : BaseSpecification<UserPermission>
    {
        public UserPermissionByUserAndPermissionSpec(int userId, int permissionId)
            : base(x => x.AppUserId == userId && x.PermissionId == permissionId)
        {
        }
    }
}
