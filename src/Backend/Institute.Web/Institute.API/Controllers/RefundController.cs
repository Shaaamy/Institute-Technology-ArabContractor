using Institute.API.DTOs.PaymentDtos;
using Institute.Application.Interfaces.IService;
using Institute.Application.Services;
using Institute.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RefundController : ControllerBase
    {
        private readonly IRefundService _refundService;
        private readonly ICurrentUserService _currentUser;
        private readonly ICheckoutService _checkoutService;
        private readonly BankPaymentService _bankPaymentService;
        private readonly IUserPermissionService _permissionService;

        public RefundController(
            IRefundService refundService,
            ICurrentUserService currentUser,
            ICheckoutService checkoutService,
            BankPaymentService bankPaymentService,
            IUserPermissionService permissionService)
        {
            _refundService = refundService;
            _currentUser = currentUser;
            _checkoutService = checkoutService;
            _bankPaymentService = bankPaymentService;
            _permissionService = permissionService;
        }

        // ═══════════════════════════════════════════════════════════════
        //  USER ENDPOINTS
        // ═══════════════════════════════════════════════════════════════

        /// POST /api/refund
        [HttpPost]
        public async Task<IActionResult> CreateRefundRequest([FromBody] CreateRefundRequestDto dto)
        {
            var clerkUserId = _currentUser.UserId;
            if (string.IsNullOrEmpty(clerkUserId))
                return Unauthorized(new { success = false, message = "يرجى تسجيل الدخول." });

            var user = await _checkoutService.GetUserByClerkIdAsync(clerkUserId);
            if (user == null)
                return BadRequest(new { success = false, message = "المستخدم غير موجود." });

            var order = await _checkoutService.GetOrderByIdAsync(dto.OrderId);
            if (order == null || order.UserId != user.Id)
                return NotFound(new { success = false, message = "الطلب غير موجود." });

            if (order.Status != Domain.Enums.OrderStatus.Paid)
                return BadRequest(new { success = false, message = "يمكن طلب الاسترداد فقط للطلبات المدفوعة." });

            var orderItem = order.Items.FirstOrDefault(i => i.PlanworkId == dto.PlanworkId);
            if (orderItem == null)
                return BadRequest(new { success = false, message = "الكورس غير موجود في هذا الطلب." });

            try
            {
                var refund = await _refundService.CreateAsync(
                    userId: user.Id,
                    orderId: dto.OrderId,
                    planworkId: dto.PlanworkId,
                    amount: orderItem.Price,
                    reason: dto.Reason,
                    details: dto.Details,
                    bankName: dto.BankName,
                    accountNumber: dto.AccountNumber,
                    accountHolder: dto.AccountHolder,
                    iban: dto.Iban
                );

                return Ok(new
                {
                    success = true,
                    message = "تم إرسال طلب الاسترداد بنجاح. سيتم مراجعته خلال 3-5 أيام عمل.",
                    data = MapToDto(refund)
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// GET /api/refund/my
        [HttpGet("my")]
        public async Task<IActionResult> GetMyRefunds()
        {
            var user = await _checkoutService.GetUserByClerkIdAsync(_currentUser.UserId ?? "");
            if (user == null)
                return Unauthorized();

            var requests = await _refundService.GetByUserIdAsync(user.Id);
            return Ok(new { success = true, data = requests.Select(MapToDto) });
        }

        /// GET /api/refund/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _checkoutService.GetUserByClerkIdAsync(_currentUser.UserId ?? "");
            if (user == null)
                return Unauthorized();

            var request = await _refundService.GetByIdAsync(id);
            if (request == null)
                return NotFound(new { success = false, message = "الطلب غير موجود." });

            // ✅ Owner check — بس صاحب الطلب يقدر يشوفه
            if (request.UserId != user.Id)
                return Forbid();

            return Ok(new { success = true, data = MapToDto(request) });
        }

        // ═══════════════════════════════════════════════════════════════
        //  ADMIN ENDPOINTS
        // ═══════════════════════════════════════════════════════════════

        /// GET /api/refund/admin/all?status=Pending
        [HttpGet("admin/all")]
        public async Task<IActionResult> GetAll([FromQuery] string? status = null)
        {
            if (!await HasRefundAccessAsync())
                return Forbid();

            var requests = await _refundService.GetAllAsync(status);
            return Ok(new
            {
                success = true,
                total = requests.Count,
                data = requests.Select(MapToDto)
            });
        }

        /// PUT /api/refund/{id}/approve
        [HttpPut("{id:int}/approve")]
        public async Task<IActionResult> Approve(int id, [FromBody] ApproveRefundDto dto)
        {
            if (!await HasRefundAccessAsync())
                return Forbid();

            var (isSuccess, message) = await _refundService.ApproveAsync(id, dto.AdminNote);
            if (!isSuccess)
                return BadRequest(new { success = false, message });

            var request = await _refundService.GetByIdAsync(id);
            return Ok(new { success = true, message, data = MapToDto(request!) });
        }

        /// PUT /api/refund/{id}/reject
        [HttpPut("{id:int}/reject")]
        public async Task<IActionResult> Reject(int id, [FromBody] RejectRefundDto dto)
        {
            if (!await HasRefundAccessAsync())
                return Forbid();

            if (string.IsNullOrWhiteSpace(dto.RejectionReason))
                return BadRequest(new { success = false, message = "يجب ذكر سبب الرفض." });

            var (isSuccess, message) = await _refundService.RejectAsync(id, dto.RejectionReason);
            if (!isSuccess)
                return BadRequest(new { success = false, message });

            var request = await _refundService.GetByIdAsync(id);
            return Ok(new { success = true, message, data = MapToDto(request!) });
        }

        /// PUT /api/refund/{id}/sent
        [HttpPut("{id:int}/sent")]
        public async Task<IActionResult> MarkAsSent(int id, [FromBody] MarkSentDto dto)
        {
            if (!await HasRefundAccessAsync())
                return Forbid();

            var (isSuccess, message) = await _refundService.MarkAsSentAsync(
                id, dto.AdminNote, _bankPaymentService);
            if (!isSuccess)
                return BadRequest(new { success = false, message });

            var request = await _refundService.GetByIdAsync(id);
            return Ok(new { success = true, message, data = MapToDto(request!) });
        }

        // ─── Permission check — same rule the frontend already trusts ──
        // Grants access if the caller is a manager, OR has been granted the
        // "Refunds" permission (matching UserPermissionsMeController's logic
        // and the "permissionName: 'Refunds'" tab check in the React admin UI).
        private async Task<bool> HasRefundAccessAsync()
        {
            var clerkId = _currentUser.UserId;
            if (string.IsNullOrEmpty(clerkId))
                return false;

            var (isManager, permissions) = await _permissionService.GetMyRoleAsync(clerkId);

            return isManager || (permissions?.Any(p =>
                string.Equals(p, "Refunds", StringComparison.OrdinalIgnoreCase)) ?? false);
        }

        // ─── Helper mapper ─────────────────────────────────────────────
        private static RefundRequestResponseDto MapToDto(RefundRequest r) => new()
        {
            Id = r.Id,
            RefNumber = r.RefNumber,
            OrderId = r.OrderId,
            OrderNumber = r.Order?.OrderNumber,
            UserId = r.UserId,
            UserFullName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}".Trim() : null,
            UserEmail = r.User?.Email,
            PlanworkId = r.PlanworkId,
            CourseTitle = r.Planwork?.ServiceTitle,
            Amount = r.Amount,
            Currency = r.Currency,
            Reason = r.Reason,
            Details = r.Details,
            Status = r.Status,
            BankName = r.BankName,
            AccountNumber = r.AccountNumber,
            AccountHolder = r.AccountHolder,
            Iban = r.Iban,
            AdminNote = r.AdminNote,
            RejectionReason = r.RejectionReason,
            RequestedAt = r.RequestedAt,
            ApprovedAt = r.ApprovedAt,
            SentAt = r.SentAt,
            RejectedAt = r.RejectedAt
        };
    }
}