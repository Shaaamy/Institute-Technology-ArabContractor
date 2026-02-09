namespace Institute.Application.DTOs.Gateway
{
    public class GatewayCaptureRequest
    {
        public string ApiOperation { get; set; } = "CAPTURE";
        public CaptureTransactionData Transaction { get; set; } = new();
    }

    public class CaptureTransactionData
    {
        public string Amount { get; set; } = string.Empty;
        public string Currency { get; set; } = "EGP";
    }

    public class GatewayVoidRequest
    {
        public string ApiOperation { get; set; } = "VOID";
        public VoidTransactionData Transaction { get; set; } = new();
    }

    public class VoidTransactionData
    {
        public string? TargetTransactionId { get; set; }
    }
}
