namespace Institute.Application.DTOs.Refund
{
    public class GatewayRefundRequest
    {
        public string ApiOperation { get; set; } = "REFUND";
        public RefundTransactionData Transaction { get; set; } = new();
    }

    public class RefundTransactionData
    {
        public string Amount { get; set; } = string.Empty;
        public string Currency { get; set; } = "EGP";
    }

    public class GatewayRefundResponse
    {
        public string? Result { get; set; }
        public GatewayResponseData? Response { get; set; }
        public RefundTransactionResponse? Transaction { get; set; }
    }

    public class GatewayResponseData
    {
        public string? GatewayCode { get; set; }
        public string? AcquirerMessage { get; set; }
    }

    public class RefundTransactionResponse
    {
        public string? Id { get; set; }
        public string? Type { get; set; }
    }
}
