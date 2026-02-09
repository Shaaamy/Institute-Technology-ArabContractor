using Institute.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces
{
    public interface ITransactionLogService
    {
        Task<TransactionLog> LogTransactionAsync(
            int orderId,
            string transactionId,
            string transactionType,
            decimal amount,
            string status,
            string? gatewayCode = null,
            string? gatewayResponse = null,
            string? errorMessage = null);

        Task UpdateTransactionStatusAsync(
            string transactionId,
            string status,
            string? gatewayResponse = null,
            string? gatewayCode = null,
            string? errorMessage = null);
    }
}
