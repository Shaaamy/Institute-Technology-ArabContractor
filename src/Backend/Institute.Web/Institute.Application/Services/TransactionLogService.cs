using Institute.Application.Interfaces;
using Institute.Domain.Entities;
using Institute.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class TransactionLogService : ITransactionLogService
    {
        private readonly IRepository<TransactionLog> _repo;
        private readonly AppDbContext _context;
        private readonly ILogger<TransactionLogService> _logger;

        public TransactionLogService(
            IRepository<TransactionLog> repo, 
            AppDbContext context,
            ILogger<TransactionLogService> logger)
        {
            _repo = repo;
            _context = context;
            _logger = logger;
        }

        public async Task<TransactionLog> LogTransactionAsync(
            int orderId,
            string transactionId,
            string transactionType,
            decimal amount,
            string status,
            string? gatewayCode = null,
            string? gatewayResponse = null,
            string? errorMessage = null)
        {
            var log = new TransactionLog
            {
                OrderId = orderId,
                TransactionId = transactionId,
                TransactionType = transactionType,
                Amount = amount,
                Status = status,
                GatewayCode = gatewayCode,
                GatewayResponse = SanitizeResponse(gatewayResponse),
                ErrorMessage = errorMessage,
                CreatedAt = DateTime.UtcNow
            };

            await _repo.AddAsync(log);
            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "Transaction logged: {TransactionId} | Type: {Type} | Order: {OrderId} | Status: {Status}",
                transactionId, transactionType, orderId, status);

            return log;
        }

        public async Task UpdateTransactionStatusAsync(
            string transactionId,
            string status,
            string? gatewayResponse = null,
            string? gatewayCode = null,
            string? errorMessage = null)
        {
            var logs = await _repo.GetAllAsync();
            var log = logs.FirstOrDefault(t => t.TransactionId == transactionId);

            if (log != null)
            {
                log.Status = status;
                if (gatewayResponse != null)
                {
                    log.GatewayResponse = SanitizeResponse(gatewayResponse);
                }
                if (gatewayCode != null)
                {
                    log.GatewayCode = gatewayCode;
                }
                if (errorMessage != null)
                {
                    log.ErrorMessage = errorMessage;
                }
                _repo.Update(log);
                await _context.SaveChangesAsync();

                _logger.LogInformation(
                    "Transaction {TransactionId} status updated to {Status}",
                    transactionId, status);
            }
        }

        private string? SanitizeResponse(string? response)
        {
            if (string.IsNullOrEmpty(response)) return response;

            // Mask card numbers (keep last 4 digits)
            var sanitized = Regex.Replace(
                response,
                @"\b(\d{12})(\d{4})\b",
                "************$2");

            // Mask CVV
            sanitized = Regex.Replace(
                sanitized,
                @"""cvv""\s*:\s*""\d{3,4}""",
                @"""cvv"":""***""");

            return sanitized;
        }
    }
}
