using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.DTOs.AdminDtos
{
    public class PaidOrderDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = null!;
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string? UserEmail { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<string> CoursesTitles { get; set; } = new();
    }
}
