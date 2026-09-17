using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.Entities
{
    public class UserPermission
    {
        public int Id { get; set; }

        public int AppUserId { get; set; }
        public AppUser AppUser { get; set; }

        public int PermissionId { get; set; }
        public Permission Permission { get; set; }
    }
}
