namespace Institute.API.DTOs
{
    public class NewsListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public DateTime PublishedAt { get; set; }
        public string? ImageUrl { get; set; }
        public List<string?>? ImageUrls { get; set; }
    }


}
