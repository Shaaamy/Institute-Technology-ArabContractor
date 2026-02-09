using System;

namespace Institute.Domain.Entities
{
    public class TransactionLog
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public virtual Order Order { get; set; } = null!;

        public string TransactionId { get; set; } = string.Empty;
        public string TransactionType { get; set; } = string.Empty; // PAYMENT, REFUND, VOID, CAPTURE
        
        public decimal Amount { get; set; }
        public string Status { get; set; } = "PENDING"; // SUCCESS, FAILED
        
        public string? GatewayCode { get; set; }
        public string? GatewayResponse { get; set; }
        public string? ErrorMessage { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
