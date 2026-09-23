using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.Entities
{
    public class Permission
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!; // "News", "Courses", "Lecturer"
        public ICollection<UserPermission> UserPermissions { get; set; }
                    = new HashSet<UserPermission>();

    }
}
