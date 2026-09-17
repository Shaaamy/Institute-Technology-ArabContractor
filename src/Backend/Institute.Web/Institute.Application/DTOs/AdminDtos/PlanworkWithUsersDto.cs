using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.DTOs.AdminDtos
{
    public class PlanworkWithUsersDto
    {
        public int Id { get; set; }
        public string? ServiceTitle { get; set; }
        public int UsersCount { get; set; }
        public decimal TotalRevenue { get; set; }
        public List<UserEnrollmentDto> Users { get; set; } = new();
    }
}
