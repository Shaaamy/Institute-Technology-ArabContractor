using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class Planwork
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

    public string? PlanUser { get; set; }

    public string? PlanPass { get; set; }

    public decimal? PlanCost { get; set; }
    public bool IsOnline { get; set; }      //added this 
    public string OnlineLink { get; set; }      //added this 
    public decimal? OnlineCost { get; set; }      //added this 
    public string? Slug { get; set; }
    public string? SKU { get; set; }


    // 🔹 Navigation
    public Planwork? Parent { get; set; }
    public ICollection<Planwork> Children { get; set; } = new List<Planwork>();

    public ICollection<PlanFile> Files { get; set; } = new List<PlanFile>();
    public ICollection<Enrollment> Enrollments { get; set; } = new HashSet<Enrollment>();
}
