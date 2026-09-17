using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications;
using Microsoft.Extensions.Logging;

namespace Institute.Application.Services
{
    public class RefundService : IRefundService
    {
        private readonly IRepository<RefundRequest> _refundRepo;
        private readonly IRepository<Order> _orderRepo;
        private readonly IRepository<Enrollment> _enrollmentRepo;
        private readonly IRepository<Payment> _paymentRepo;
        private readonly IRepository<Planwork> _planworkRepo;
        private readonly ILogger<RefundService> _logger;

        public RefundService(
            IRepository<RefundRequest> refundRepo,
            IRepository<Order> orderRepo,
            IRepository<Enrollment> enrollmentRepo,
            IRepository<Payment> paymentRepo,
            IRepository<Planwork> planworkRepo,
            ILogger<RefundService> logger)
        {
            _refundRepo = refundRepo;
            _orderRepo = orderRepo;
            _enrollmentRepo = enrollmentRepo;
            _paymentRepo = paymentRepo;
            _planworkRepo = planworkRepo;
            _logger = logger;
        }

        // ─── Create ───────────────────────────────────────────────────────
        public async Task<RefundRequest> CreateAsync(
            int userId, int orderId, int planworkId, decimal amount,
            string reason, string? details,
            string? bankName, string? accountNumber,
            string? accountHolder, string? iban)
        {
            var planwork = (await _planworkRepo.GetAllWithSpecAsync(
                new BaseSpecification<Planwork>(p => p.ChildId == planworkId)))
                .FirstOrDefault();

            if (planwork == null)
                throw new InvalidOperationException("الكورس غير موجود.");

            if (!TryParseCourseStartDate(planwork.CourseDate, out var courseStartDate))
                throw new InvalidOperationException("تاريخ بدء الكورس غير محدد أو غير صحيح.");

            var daysLeft = (courseStartDate.Date - DateTime.UtcNow.Date).TotalDays;

            if (daysLeft < 2)
                throw new InvalidOperationException(
                    "لا يمكن طلب الاسترداد. تبقى أقل من يومين على بدء الكورس.");

            if (daysLeft <= 7)
                amount = amount * 0.75m;

            var existing = (await _refundRepo.GetAllWithSpecAsync(
                new BaseSpecification<RefundRequest>(
                    r => r.OrderId == orderId &&
                         r.PlanworkId == planworkId &&
                         (r.Status == "Pending" || r.Status == "Approved"))))
                .FirstOrDefault();

            if (existing != null)
                throw new InvalidOperationException(
                    "يوجد طلب استرداد قيد المعالجة لهذا الكورس مسبقاً.");

            var refRequest = new RefundRequest
            {
                RefNumber = GenerateRefNumber(),
                OrderId = orderId,
                UserId = userId,
                PlanworkId = planworkId,
                Amount = amount,
                Currency = "EGP",
                Reason = reason,
                Details = details,
                Status = "Pending",
                BankName = bankName,
                AccountNumber = accountNumber,
                AccountHolder = accountHolder,
                Iban = iban,
                RequestedAt = DateTime.UtcNow
            };

            await _refundRepo.AddAsync(refRequest);
            await _refundRepo.SaveChangesAsync();

            _logger.LogInformation(
                "Refund {RefNumber} created. Order={OrderId}, User={UserId}, DaysLeft={DaysLeft}, Amount={Amount}",
                refRequest.RefNumber, orderId, userId, daysLeft, amount);

            return refRequest;
        }

        // ─── Read ─────────────────────────────────────────────────────────
        public async Task<RefundRequest?> GetByIdAsync(int id)
        {
            var spec = new BaseSpecification<RefundRequest>(r => r.Id == id);
            spec.AddInclude(r => r.User);
            spec.AddInclude(r => r.Order);
            spec.AddInclude(r => r.Planwork);
            return (await _refundRepo.GetAllWithSpecAsync(spec)).FirstOrDefault();
        }

        public async Task<IReadOnlyList<RefundRequest>> GetAllAsync(string? statusFilter = null)
        {
            BaseSpecification<RefundRequest> spec;

            if (!string.IsNullOrWhiteSpace(statusFilter))
                spec = new BaseSpecification<RefundRequest>(r => r.Status == statusFilter);
            else
                spec = new BaseSpecification<RefundRequest>();

            spec.AddInclude(r => r.User);
            spec.AddInclude(r => r.Order);
            spec.AddInclude(r => r.Planwork);
            spec.AddOrderByDescending(r => r.RequestedAt);

            return await _refundRepo.GetAllWithSpecAsync(spec);
        }

        public async Task<IReadOnlyList<RefundRequest>> GetByUserIdAsync(int userId)
        {
            var spec = new BaseSpecification<RefundRequest>(r => r.UserId == userId);
            spec.AddInclude(r => r.Order);
            spec.AddInclude(r => r.Planwork);
            spec.AddOrderByDescending(r => r.RequestedAt);
            return await _refundRepo.GetAllWithSpecAsync(spec);
        }

        // ─── Admin actions ─────────────────────────────────────────────────
        public async Task<(bool IsSuccess, string Message)> ApproveAsync(int id, string? adminNote)
        {
            var request = await GetByIdAsync(id);
            if (request == null)
                return (false, "طلب الاسترداد غير موجود.");

            if (request.Status != "Pending")
                return (false, $"لا يمكن الموافقة على طلب في حالة: {request.Status}");

            request.Status = "Approved";
            request.AdminNote = adminNote;
            request.ApprovedAt = DateTime.UtcNow;
            _refundRepo.Update(request);

            var enrollSpec = new BaseSpecification<Enrollment>(
                e => e.UserId == request.UserId && e.PlanworkId == request.PlanworkId);
            var enrollment = (await _enrollmentRepo.GetAllWithSpecAsync(enrollSpec)).FirstOrDefault();
            if (enrollment != null)
                _enrollmentRepo.Delete(enrollment);

            await _refundRepo.SaveChangesAsync();

            _logger.LogInformation(
                "Refund {RefNumber} approved. Enrollment removed.", request.RefNumber);

            return (true, "تمت الموافقة على طلب الاسترداد وتم إلغاء التسجيل في الكورس.");
        }

        public async Task<(bool IsSuccess, string Message)> RejectAsync(int id, string rejectionReason)
        {
            var request = await GetByIdAsync(id);
            if (request == null)
                return (false, "طلب الاسترداد غير موجود.");

            if (request.Status != "Pending")
                return (false, $"لا يمكن رفض طلب في حالة: {request.Status}");

            request.Status = "Rejected";
            request.RejectionReason = rejectionReason;
            request.RejectedAt = DateTime.UtcNow;
            _refundRepo.Update(request);
            await _refundRepo.SaveChangesAsync();

            _logger.LogInformation("Refund {RefNumber} rejected.", request.RefNumber);
            return (true, "تم رفض طلب الاسترداد.");
        }

        public async Task<(bool IsSuccess, string Message)> MarkAsSentAsync(
            int id,
            string? adminNote,
            BankPaymentService bankService)
        {
            var request = await GetByIdAsync(id);
            if (request == null)
                return (false, "طلب الاسترداد غير موجود.");

            if (request.Status != "Approved")
                return (false, "يجب الموافقة على الطلب أولاً قبل تحديده كمُرسَل.");

            var paymentSpec = new BaseSpecification<Payment>(p => p.OrderId == request.OrderId);
            var payment = (await _paymentRepo.GetAllWithSpecAsync(paymentSpec)).FirstOrDefault();

            if (payment == null || string.IsNullOrEmpty(payment.TransactionRef))
                return (false, "لم يتم العثور على بيانات الدفع الأصلية.");

            _logger.LogInformation(
                "Calling bank refund for Order {OrderNumber}, TransactionRef {TransactionRef}, Amount {Amount}",
                request.Order.OrderNumber, payment.TransactionRef, request.Amount);

            var (bankSuccess, gatewayResponse) = await bankService.RefundPaymentAsync(
                orderNumber: request.Order.OrderNumber,
                transactionId: payment.TransactionRef,
                amount: request.Amount
            );

            if (!bankSuccess)
            {
                _logger.LogWarning(
                    "Bank refund failed for RefundRequest {Id}: {Response}", id, gatewayResponse);
                return (false, "البنك رفض عملية الاسترداد. يرجى المحاولة لاحقاً.");
            }

            request.Status = "Sent";
            request.SentAt = DateTime.UtcNow;
            if (!string.IsNullOrWhiteSpace(adminNote))
                request.AdminNote = adminNote;
            _refundRepo.Update(request);

            await _refundRepo.SaveChangesAsync();

            _logger.LogInformation(
                "Refund {RefNumber} sent successfully via bank.", request.RefNumber);

            return (true, "تم إرسال الاسترداد عبر البنك بنجاح.");
        }

        // ─── Helpers ──────────────────────────────────────────────────────

        /// <summary>
        /// W7 FIX: collision-resistant ref number using CSPRNG.
        /// Old: REF-{date}-{Random(1000,9999)}  →  only 9,000 values/day
        /// New: REF-{date}-{8 hex chars}         →  4,294,967,296 values/day
        /// </summary>
        private static string GenerateRefNumber()
        {
            var date = DateTime.UtcNow.ToString("yyyyMMdd");
            var suffix = Convert.ToHexString(
                System.Security.Cryptography.RandomNumberGenerator.GetBytes(4));
            return $"REF-{date}-{suffix}";
        }

        private static bool TryParseCourseStartDate(string? courseDateStr, out DateTime result)
        {
            result = DateTime.MinValue;
            if (string.IsNullOrWhiteSpace(courseDateStr)) return false;

            var parts = courseDateStr.Split(new[] { " - " }, StringSplitOptions.None);
            var raw = parts[0].Trim();

            var formats = new[]
            {
                "yyyy/MM/dd", "yyyy-MM-dd", "yyyy/M/d", "yyyy-M-d",
                "dd/MM/yyyy", "d/M/yyyy",
                "MM/dd/yyyy"
            };

            return DateTime.TryParseExact(
                raw, formats,
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None,
                out result);
        }
    }
}