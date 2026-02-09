namespace Institute.Application.DTOs.Gateway
{
    public class GatewayInitiateResponse
    {
        public string? Result { get; set; }
        public SessionData? Session { get; set; }
        public string? SuccessIndicator { get; set; }
    }

    public class SessionData
    {
        public string? Id { get; set; }
        public string? UpdateStatus { get; set; }
        public string? Version { get; set; }
    }
}
