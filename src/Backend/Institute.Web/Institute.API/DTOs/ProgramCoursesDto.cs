namespace Institute.API.DTOs
{
    public class ProgramCoursesDto
    {
        public int ProgramId { get; set; }
        public string? Slug { get; set; }

        public string? ProgramName { get; set; }
        public List<CourseCardDto> Courses { get; set; } = new();
        // ✅ Online fields
        public bool IsOnline { get; set; }
        public decimal? OnlineCost { get; set; }

    }
}
