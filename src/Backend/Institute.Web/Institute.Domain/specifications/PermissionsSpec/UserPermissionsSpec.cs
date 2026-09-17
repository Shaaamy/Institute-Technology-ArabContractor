using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.PermissionsSpec
{
    public class UserPermissionsSpec : BaseSpecification<UserPermission>
    {
        public UserPermissionsSpec(int userId)
           : base(x => x.AppUserId == userId)
        {
            // Include Permission navigation property
            AddInclude(x => x.Permission);
        }
    }
}
