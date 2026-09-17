using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.DTOs.AdminDtos
{
    public class PlanworkDto
    {
        public int ChildId { get; set; }
        public int? ParentId { get; set; }

        public string? ServiceTitle { get; set; }
        public int? Priority { get; set; }

        public bool? MainFlag { get; set; }
        public bool? DetailsFlag { get; set; }
        public bool? SpecialFlag { get; set; }

        public string? CourseDesc { get; set; }
        public string? CoursePlace { get; set; }
        public string? CourseDate { get; set; }
        public string? CourseDays { get; set; }
        public string? CourseContent { get; set; }

        public decimal? PlanCost { get; set; }

        // ✅ Online fields
        public bool IsOnline { get; set; }
        public string? OnlineLink { get; set; }
        public decimal? OnlineCost { get; set; }

        public string? Slug { get; set; }
        public string? SKU { get; set; }

        // 🔥 مهم للـ Tree UI
        public List<PlanworkDto>? Children { get; set; }
    }
}