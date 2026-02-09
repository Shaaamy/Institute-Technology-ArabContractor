namespace Institute.Application.DTOs.Gateway
{
    public class GatewayInitiateRequest
    {
        public string ApiOperation { get; set; } = "INITIATE_CHECKOUT";
        public InteractionData Interaction { get; set; } = new();
        public OrderData Order { get; set; } = new();
    }

    public class InteractionData
    {
        public string Operation { get; set; } = "PURCHASE";
        public string ReturnUrl { get; set; } = string.Empty;
        public string? MerchantName { get; set; }
    }

    public class OrderData
    {
        public string Id { get; set; } = string.Empty;
        public string Amount { get; set; } = string.Empty;
        public string Currency { get; set; } = "EGP";
        public string? Description { get; set; }
    }
}
