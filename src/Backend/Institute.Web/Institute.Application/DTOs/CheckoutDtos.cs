namespace Institute.Application.DTOs
{
    public class CheckoutResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public CheckoutDataDto? Data { get; set; }
    }

    public class CheckoutDataDto
    {
        public string SessionId { get; set; }
        public string SuccessIndicator { get; set; }
        public string OrderId { get; set; }
        public string CheckoutJsUrl { get; set; }
    }
}