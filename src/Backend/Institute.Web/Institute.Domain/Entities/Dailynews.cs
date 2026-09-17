using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class Dailynews
{
    public int NewsId { get; set; }
    public DateTime? NewsDate { get; set; }
    public string? ATitel { get; set; }
    public string? ADetails { get; set; }
    public int? MainPagePeriority { get; set; }
    public bool? Approved { get; set; }
    public bool? ShowFlag { get; set; }
    public virtual ICollection<NewsPic> NewsPics { get; set; } = new List<NewsPic>();
}

