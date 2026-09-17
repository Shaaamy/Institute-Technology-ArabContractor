using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.Entities
{
    public class Enrollment
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public AppUser? User { get; set; }

        public int PlanworkId { get; set; }
        public Planwork? Planwork { get; set; }

        public int? OrderId { get; set; }

        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
        public bool Attended { get; set; }
        public bool IsOnline { get; set; }

    }
}
