namespace Institute.API.DTOs
{
    public class PaymentSettings
    {
        public string MerchantId { get; set; }
        public string ApiPassword { get; set; }
        public string BaseUrl { get; set; }
        public string ApiVersion { get; set; }
        public string MerchantName { get; set; }
        public string Currency { get; set; }
        public string ReturnUrl { get; set; }
        public string WebhookSecret { get; set; }
        public string CancelUrl { get; set; }
        public bool RequireWebhookVerification { get; set; }
    }
}
