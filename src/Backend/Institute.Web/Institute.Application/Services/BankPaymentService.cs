using Institute.API.DTOs;
using Institute.Application.DTOs;
using Institute.Domain.Entities;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    /// <summary>
    /// Wraps all Mastercard Hosted Checkout gateway calls.
    ///
    /// W4 FIX — URL consistency:
    ///   All three methods now build paths the SAME way:
    ///   they use ONLY the relative path (/api/rest/version/.../merchant/...)
    ///   and rely on HttpClient.BaseAddress (configured in Program.cs via
    ///   "BankClient") for the host.
    ///
    ///   Previously InitiateCheckoutAsync used a relative path while
    ///   VerifyPaymentAsync prepended BaseUrl itself, so the two calls
    ///   could silently point to different hosts if the settings drifted.
    /// </summary>
    public class BankPaymentService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly PaymentSettings _settings;

        // Base path fragment shared by all gateway calls
        private string GatewayBase =>
            $"/api/rest/version/{_settings.ApiVersion}/merchant/{_settings.MerchantId}";

        public BankPaymentService(
            IHttpClientFactory httpClientFactory,
            IOptions<PaymentSettings> options)
        {
            _httpClientFactory = httpClientFactory;
            _settings = options.Value;
        }

        // ── Initiate checkout session ──────────────────────────────────
        public async Task<CheckoutResponseDto> InitiateCheckoutAsync(Order order)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("BankClient");
                SetBasicAuth(client); // W4: auth was missing on initiate call

                var payload = new
                {
                    apiOperation = "INITIATE_CHECKOUT",
                    interaction = new
                    {
                        operation = "PURCHASE",
                        returnUrl = $"{_settings.ReturnUrl}?orderId={order.Id}",
                        cancelUrl = _settings.CancelUrl,
                        merchant = new { name = _settings.MerchantName },
                        displayControl = new
                        {
                            billingAddress = "HIDE",
                            customerEmail = "HIDE"
                        }
                    },
                    order = new
                    {
                        id = order.OrderNumber,
                        amount = order.TotalAmount.ToString("F2"),
                        currency = _settings.Currency,
                        description = $"Order #{order.Id}"
                    }
                };

                // ── W4: relative path only — HttpClient.BaseAddress supplies host ──
                var url = $"{GatewayBase}/session";
                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await client.PostAsync(url, content);

                if (!response.IsSuccessStatusCode)
                    throw new Exception(await response.Content.ReadAsStringAsync());

                var body = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(body);
                var root = doc.RootElement;

                var sessionId = root.GetProperty("session").GetProperty("id").GetString();
                var successIndicator = root.GetProperty("successIndicator").GetString();

                order.GatewaySessionId = sessionId;
                order.SuccessIndicator = successIndicator;

                return new CheckoutResponseDto
                {
                    Success = true,
                    Message = "Session created successfully",
                    Data = new CheckoutDataDto
                    {
                        SessionId = sessionId,
                        SuccessIndicator = successIndicator,
                        OrderId = order.Id.ToString(),
                        CheckoutJsUrl = $"{_settings.BaseUrl}/static/checkout/checkout.min.js"
                    }
                };
            }
            catch (Exception ex)
            {
                return new CheckoutResponseDto { Success = false, Message = ex.Message };
            }
        }

        // ── Verify payment with bank ───────────────────────────────────
        public async Task<(bool IsSuccess, string? SuccessIndicator, string? GatewayResponse)>
            VerifyPaymentAsync(string orderNumber)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("BankClient");
                SetBasicAuth(client);

                // ── W4 FIX: relative path only (was absolute before) ──
                var url = $"{GatewayBase}/order/{orderNumber}";
                var response = await client.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                    return (false, null, await response.Content.ReadAsStringAsync());

                var body = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(body);
                var root = doc.RootElement;

                var result = root.GetProperty("result").GetString();
                string? successInd = root.TryGetProperty("successIndicator", out var p)
                                         ? p.GetString() : null;

                return (result == "SUCCESS", successInd, body);
            }
            catch (Exception ex)
            {
                return (false, null, ex.Message);
            }
        }

        // ── Issue refund ───────────────────────────────────────────────
        public async Task<(bool IsSuccess, string? GatewayResponse)>
            RefundPaymentAsync(string orderNumber, string transactionId, decimal amount)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("BankClient");
                SetBasicAuth(client);

                var payload = new
                {
                    apiOperation = "REFUND",
                    transaction = new
                    {
                        amount = amount.ToString("F2"),
                        currency = _settings.Currency
                    }
                };

                // ── W4: relative path only ──
                var url = $"{GatewayBase}/order/{orderNumber}" +
                               $"/transaction/refund-{Guid.NewGuid():N}";
                var response = await client.PutAsync(url,
                    new StringContent(
                        JsonSerializer.Serialize(payload),
                        Encoding.UTF8,
                        "application/json"));

                var body = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                    return (false, body);

                using var doc = JsonDocument.Parse(body);
                var result = doc.RootElement.TryGetProperty("result", out var r)
                                    ? r.GetString() : null;
                return (result == "SUCCESS", body);
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            }
        }

        // ── Helper ─────────────────────────────────────────────────────
        private void SetBasicAuth(HttpClient client)
        {
            var authBytes = Encoding.ASCII.GetBytes(
                $"merchant.{_settings.MerchantId}:{_settings.ApiPassword}");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", Convert.ToBase64String(authBytes));
        }
    }
}