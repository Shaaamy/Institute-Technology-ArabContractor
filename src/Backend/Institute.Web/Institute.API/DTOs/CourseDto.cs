namespace Institute.API.DTOs
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string? Slug { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Place { get; set; }
        public string? Date { get; set; }
        public string? Days { get; set; }
        public string? Content { get; set; }
        public decimal? Cost { get; set; }
        public bool? OnSale { get; set; }
        public List<CourseFileDto> Files { get; set; } = new();
        public bool IsOnline { get; set; }
        public decimal? OnlineCost { get; set; }
    }
}
