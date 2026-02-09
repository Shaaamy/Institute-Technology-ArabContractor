using System;

namespace Institute.Domain.Entities
{
    public class PaymentLifecycleDetail
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public virtual Order Order { get; set; } = null!;

        public string? SessionId { get; set; }
        public string? SuccessIndicator { get; set; }
        public string? ResultIndicator { get; set; }
        
        public decimal? Amount { get; set; }
        public string Currency { get; set; } = "EGP";
        
        public string? CardBrand { get; set; }
        public string? MaskedCardNumber { get; set; }
        
        public string? GatewayResponse { get; set; }
        
        public decimal? TotalRefundedAmount { get; set; } = 0;
        public string? RefundReason { get; set; }
        public DateTime? RefundedAt { get; set; }
        
        public DateTime? PaidAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
