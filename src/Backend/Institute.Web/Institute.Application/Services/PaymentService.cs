using Institute.API.DTOs;
using Institute.Application.DTOs.Gateway;
using Institute.Application.DTOs.Refund;
using Institute.Application.Interfaces;
using Institute.Domain.Entities;
using Institute.Infrastructure;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class BankMisrPaymentService
    {
        private readonly HttpClient _http;
        private readonly BankMisrOptions _opt;
        private readonly IRepository<PaymentLifecycleDetail> _lifecycleRepo;
        private readonly ITransactionLogService _transactionLog;
        private readonly AppDbContext _context;
        private readonly ILogger<BankMisrPaymentService> _logger;

        public BankMisrPaymentService(
            HttpClient http, 
            IOptions<BankMisrOptions> opt,
            IRepository<PaymentLifecycleDetail> lifecycleRepo,
            ITransactionLogService transactionLog,
            AppDbContext context,
            ILogger<BankMisrPaymentService> logger)
        {
            _http = http;
            _opt = opt.Value;
            _lifecycleRepo = lifecycleRepo;
            _transactionLog = transactionLog;
            _context = context;
            _logger = logger;

            ConfigureHttpClient();
        }

        private void ConfigureHttpClient()
        {
            var auth = Convert.ToBase64String(
                Encoding.UTF8.GetBytes($"{_opt.ApiUsername}:{_opt.ApiPassword}")
            );
            _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", auth);
        }

        public async Task<string> CreateCheckoutSessionAsync(int orderId, decimal amount, string currency)
        {
            var request = new GatewayInitiateRequest
            {
                Interaction = new InteractionData
                {
                    ReturnUrl = $"{_opt.ReturnUrl}?orderId={orderId}"
                },
                Order = new OrderData
                {
                    Id = orderId.ToString(),
                    Amount = amount.ToString("F2"),
                    Currency = currency
                }
            };

            var url = $"{_opt.BaseUrl}/api/rest/version/{_opt.ApiVersion}/merchant/{_opt.MerchantId}/session";
            
            var res = await _http.PostAsJsonAsync(url, request);
            res.EnsureSuccessStatusCode();

            var content = await res.Content.ReadFromJsonAsync<GatewayInitiateResponse>();
            
            if (content?.Session?.Id == null)
                throw new Exception("Failed to create Bank Misr session");

            // Store metadata in our non-invasive table
            var detail = new PaymentLifecycleDetail
            {
                OrderId = orderId,
                SessionId = content.Session.Id,
                SuccessIndicator = content.SuccessIndicator,
                Amount = amount,
                Currency = currency,
                CreatedAt = DateTime.UtcNow
            };

            await _lifecycleRepo.AddAsync(detail);
            await _context.SaveChangesAsync();

            return content.Session.Id;
        }

        public async Task<bool> VerifyPaymentAsync(int orderId, string resultIndicator)
        {
            var details = await _lifecycleRepo.GetAllAsync();
            var detail = details.FirstOrDefault(d => d.OrderId == orderId);

            if (detail == null) return false;

            var isSuccess = resultIndicator == detail.SuccessIndicator;

            if (isSuccess)
            {
                detail.PaidAt = DateTime.UtcNow;
                detail.ResultIndicator = resultIndicator;
                _lifecycleRepo.Update(detail);
                await _context.SaveChangesAsync();
                
                await _transactionLog.LogTransactionAsync(
                    orderId, detail.SessionId ?? "N/A", "PAYMENT", detail.Amount ?? 0, "SUCCESS");
            }

            return isSuccess;
        }

        public async Task<bool> RefundAsync(int orderId, decimal amount, string reason)
        {
            var details = await _lifecycleRepo.GetAllAsync();
            var detail = details.FirstOrDefault(d => d.OrderId == orderId);

            if (detail == null) throw new Exception("Payment details not found for order");

            var transactionId = $"REF-{Guid.NewGuid().ToString()[..8]}";
            var url = $"{_opt.BaseUrl}/api/rest/version/{_opt.ApiVersion}/merchant/{_opt.MerchantId}/order/{orderId}/transaction/{transactionId}";

            var request = new GatewayRefundRequest
            {
                Transaction = new RefundTransactionData
                {
                    Amount = amount.ToString("F2"),
                    Currency = detail.Currency
                }
            };

            var res = await _http.PutAsJsonAsync(url, request);
            var responseContent = await res.Content.ReadAsStringAsync();
            var gatewayRes = JsonSerializer.Deserialize<GatewayRefundResponse>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            bool isSuccess = res.IsSuccessStatusCode && gatewayRes?.Result == "SUCCESS";

            await _transactionLog.LogTransactionAsync(
                orderId, transactionId, "REFUND", amount, isSuccess ? "SUCCESS" : "FAILED", 
                gatewayRes?.Response?.GatewayCode, responseContent);

            if (isSuccess)
            {
                detail.TotalRefundedAmount = (detail.TotalRefundedAmount ?? 0) + amount;
                detail.RefundedAt = DateTime.UtcNow;
                detail.RefundReason = reason;
                _lifecycleRepo.Update(detail);
                await _context.SaveChangesAsync();
            }

            return isSuccess;
        }
    }
}
