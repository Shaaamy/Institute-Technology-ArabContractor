using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.Entities
{
    public class AppUser
    {
        public int Id { get; set; }

        public string ClerkUserId { get; set; } = null!;
        public string Username { get; set; } = null!;

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; }
        public bool IsManager { get; set; }
        // Navigation
        public ICollection<Cart> Carts { get; set; } = new HashSet<Cart>();
        public ICollection<Order> Orders { get; set; } = new HashSet<Order>();
        public ICollection<Enrollment> Enrollments { get; set; } = new HashSet<Enrollment>();
        public ICollection<UserPermission> Permissions { get; set; } = new HashSet<UserPermission>();


    }
}
