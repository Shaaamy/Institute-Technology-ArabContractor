using Institute.API.DTOs;
using Institute.API.DTOs.PaymentDtos;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Application.Services;
using Institute.Domain.Entities;
using Institute.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CheckoutController : ControllerBase
    {
        private readonly ICheckoutService _checkoutService;
        private readonly BankPaymentService _bankPaymentService;
        private readonly ICurrentUserService _currentUser;
        private readonly PaymentSettings _settings;
        private readonly ILogger<CheckoutController> _logger;

        public CheckoutController(
            ICheckoutService checkoutService,
            BankPaymentService bankPaymentService,
            ICurrentUserService currentUser,
            IOptions<PaymentSettings> options,
            ILogger<CheckoutController> logger)
        {
            _checkoutService = checkoutService;
            _bankPaymentService = bankPaymentService;
            _currentUser = currentUser;
            _settings = options.Value;
            _logger = logger;
        }

        /// <summary>
        /// POST /api/checkout/checkout
        /// Called by the React frontend when user clicks "المتابعة إلى الدفع".
        /// 1. Gets the user from Clerk JWT
        /// 2. Creates an Order from their Cart
        /// 3. Initiates a Mastercard Hosted Checkout session via BankPaymentService
        /// 4. Returns sessionId + successIndicator + checkoutJsUrl to frontend
        /// </summary>
        [HttpPost("checkout")]
        [EnableRateLimiting("CheckoutLimit")]
        public async Task<IActionResult> Checkout()
        {
            // 1️⃣ Get ClerkUserId from the JWT token
            var clerkUserId = _currentUser.UserId;
            if (string.IsNullOrEmpty(clerkUserId))
            {
                _logger.LogWarning("⚠️ Checkout attempt with no ClerkUserId.");
                return Unauthorized(new { success = false, message = "غير مصرح. يرجى تسجيل الدخول." });
            }

            // 2️⃣ Find the AppUser in the database
            var user = await _checkoutService.GetUserByClerkIdAsync(clerkUserId);
            if (user == null)
            {
                _logger.LogWarning("⚠️ Checkout: user not found in DB. ClerkId={ClerkId}", clerkUserId);
                return BadRequest(new { success = false, message = "المستخدم غير موجود في قاعدة البيانات." });
            }

            // 3️⃣ Create Order from the user's active Cart
            Order order;
            try
            {
                order = await _checkoutService.CreateOrderAsync(user.Id);
                _logger.LogInformation(
                    "🛒 Order created. OrderId={OrderId}, UserId={UserId}, Amount={Amount}",
                    order.Id, user.Id, order.TotalAmount);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(
                    "⚠️ CreateOrder failed. UserId={UserId}, Reason={Reason}",
                    user.Id, ex.Message);
                return BadRequest(new { success = false, message = ex.Message });
            }

            // 4️⃣ Initiate Mastercard Hosted Checkout session
            var checkoutResponse = await _bankPaymentService.InitiateCheckoutAsync(order);
            if (!checkoutResponse.Success || checkoutResponse.Data == null)
            {
                _logger.LogError(
                    "❌ Bank session failed. OrderId={OrderId}, Message={Message}",
                    order.Id, checkoutResponse.Message);

                return StatusCode(502, new
                {
                    success = false,
                    message = checkoutResponse.Message ?? "فشل الاتصال ببوابة الدفع."
                });
            }

            order.GatewaySessionId = checkoutResponse.Data.SessionId;
            order.SuccessIndicator = checkoutResponse.Data.SuccessIndicator;
            await _checkoutService.UpdateOrderGatewayDataAsync(order);

            _logger.LogInformation(
                "🏦 Bank session created. OrderId={OrderId}, SessionId={SessionId}",
                order.Id, checkoutResponse.Data.SessionId);

            // 5️⃣ Return the session data to the React frontend
            return Ok(new
            {
                success = true,
                message = "تم إنشاء جلسة الدفع بنجاح",
                data = new
                {
                    sessionId = checkoutResponse.Data.SessionId,
                    successIndicator = checkoutResponse.Data.SuccessIndicator,
                    orderId = checkoutResponse.Data.OrderId,
                    amount = order.TotalAmount,  // ✅ أضف ده
                    checkoutJsUrl = checkoutResponse.Data.CheckoutJsUrl
                }
            });
        }

        /// <summary>
        /// GET /api/checkout/result?orderId=...&transactionRef=...
        /// Called in two scenarios:
        ///   A) By the React completeCallback (via fetch) after Mastercard JS confirms success
        ///   B) After bank redirect (when user is sent back to ReturnUrl)
        /// Verifies payment with the bank, updates Order/Enrollment, returns result.
        /// </summary>
        [HttpGet("result")]
        [AllowAnonymous]
        public async Task<IActionResult> PaymentResult(
            [FromQuery] int orderId,
            [FromQuery] string? transactionRef,
            [FromQuery] string? resultIndicator)
        {
            var refToUse = transactionRef ?? resultIndicator;

            if (orderId <= 0)
                return BadRequest(new { success = false, message = "رقم الطلب غير صحيح." });

            if (string.IsNullOrEmpty(refToUse))
                return BadRequest(new { success = false, message = "مرجع المعاملة مفقود." });

            var order = await _checkoutService.GetOrderByIdAsync(orderId);
            if (order == null)
            {
                _logger.LogWarning("⚠️ PaymentResult: order not found. OrderId={OrderId}", orderId);
                return NotFound(new { success = false, message = "الطلب غير موجود." });
            }

            // 🛡️ [1] Replay Attack Protection
            if (order.Status == OrderStatus.Paid)
            {
                _logger.LogInformation(
                    "ℹ️ PaymentResult: order already paid. OrderId={OrderId}", orderId);
                return Ok(new { success = true, message = "تم الدفع مسبقاً.", alreadyPaid = true });
            }

            if (order.Status == OrderStatus.Cancelled)
            {
                _logger.LogWarning(
                    "⚠️ PaymentResult: order already cancelled. OrderId={OrderId}", orderId);
                return BadRequest(new { success = false, message = "هذا الطلب ملغي ولا يمكن إتمامه." });
            }

            // 🛡️ [2] Order Ownership
            if (User.Identity?.IsAuthenticated == true)
            {
                var currentUser = await _checkoutService.GetUserByClerkIdAsync(_currentUser.UserId);
                if (currentUser == null || order.UserId != currentUser.Id)
                {
                    _logger.LogWarning(
                        "⚠️ PaymentResult: ownership mismatch. OrderId={OrderId}, UserId={UserId}",
                        orderId, currentUser?.Id);
                    return Forbid();
                }
            }

            // ✅ Compare indicators
            if (refToUse != order.SuccessIndicator)
            {
                _logger.LogWarning(
                    "⚠️ Indicator mismatch. OrderId={OrderId}, Expected={Expected}, Got={Got}",
                    orderId, order.SuccessIndicator, refToUse);

                order.Status = OrderStatus.Cancelled;
                await _checkoutService.UpdateOrderAsync(order);
                return BadRequest(new { success = false, message = "فشل الدفع أو بيانات غير صحيحة." });
            }

            // ✅ Double-verify with bank
            var verify = await _bankPaymentService.VerifyPaymentAsync(order.OrderNumber);
            if (!verify.IsSuccess)
            {
                _logger.LogWarning(
                    "⚠️ Bank verify failed. OrderId={OrderId}, Response={Response}",
                    orderId, verify.GatewayResponse);

                order.Status = OrderStatus.Cancelled;
                await _checkoutService.UpdateOrderAsync(order);
                return BadRequest(new { success = false, message = "البنك لم يؤكد الدفع." });
            }

            var payment = await _checkoutService.MarkOrderAsPaidAsync(
                order, refToUse, verify.GatewayResponse ?? "VerifiedByGateway");

            _logger.LogInformation(
                "✅ Payment Success. OrderId={OrderId}, TransactionRef={Ref}, UserId={UserId}, Amount={Amount}",
                orderId, refToUse, order.UserId, order.TotalAmount);

            return Ok(new PaymentResponseDto
            {
                OrderId = orderId,
                TransactionRef = refToUse,
                IsSuccess = true,
                GatewayResponse = payment?.GatewayResponse
            });
        }

        /// <summary>
        /// GET /api/checkout/order/{orderId}
        /// Returns order details — only for the order owner and only if Paid.
        /// </summary>
        [HttpGet("order/{orderId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetOrderDetails(int orderId)
        {
            if (orderId <= 0)
                return BadRequest(new { success = false, message = "رقم الطلب غير صحيح." });

            var order = await _checkoutService.GetOrderByIdAsync(orderId);
            if (order == null)
                return NotFound(new { success = false, message = "الطلب غير موجود." });

            if (order.Status != OrderStatus.Paid)
                return BadRequest(new { success = false, message = "لم يتم تأكيد الدفع بعد." });

            // 🛡️ Ownership check
            if (User.Identity?.IsAuthenticated == true)
            {
                var currentUser = await _checkoutService.GetUserByClerkIdAsync(_currentUser.UserId);
                if (currentUser == null || order.UserId != currentUser.Id)
                {
                    _logger.LogWarning(
                        "⚠️ GetOrderDetails: ownership mismatch. OrderId={OrderId}", orderId);
                    return Forbid();
                }
            }

            return Ok(new
            {
                success = true,
                data = new
                {
                    orderId = order.Id,
                    orderNumber = order.OrderNumber,
                    totalAmount = order.TotalAmount,
                    currency = _settings.Currency,
                    status = order.Status.ToString(),
                    createdAt = order.CreatedAt,
                    items = order.Items.Select(i => new
                    {
                        planworkId = i.PlanworkId,
                        price = i.Price
                    })
                }
            });
        }


    }
}