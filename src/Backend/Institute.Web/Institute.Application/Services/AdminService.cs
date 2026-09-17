using Institute.API.DTOs.AdminDtos;
using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.Enums;
using Institute.Domain.specifications.AdminSpec;
using Institute.Domain.specifications.AdminSpec.Certificates;
using Institute.Domain.specifications.AdminSpec.Course;
using Institute.Domain.specifications.AdminSpec.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly IRepository<AppUser> _userRepository;
        private readonly IRepository<Enrollment> _enrollmentRepository;
        private readonly IRepository<Planwork> _planworkRepository;
        private readonly IRepository<Certificate> _certificateRepository;
        private readonly IRepository<RefundRequest> _refundRepository;
        private readonly IRepository<Order> _orderRepository; // ← جديد
        private readonly IBlobStorage _blobStorage;
        private const string Container = "icemt";
        private const string Folder = "certificates";

        public AdminService(
            IRepository<AppUser> userRepository,
            IRepository<Enrollment> enrollmentRepository,
            IRepository<Planwork> planworkRepository,
            IRepository<Certificate> certificateRepository,
            IRepository<RefundRequest> refundRepository,
            IRepository<Order> orderRepository,
            IBlobStorage blobStorage) // ← جديد
        {
            _userRepository = userRepository;
            _enrollmentRepository = enrollmentRepository;
            _planworkRepository = planworkRepository;
            _certificateRepository = certificateRepository;
            _refundRepository = refundRepository;
            _orderRepository = orderRepository; // ← جديد
            _blobStorage = blobStorage;
        }

        public async Task<IReadOnlyList<UserWithCoursesDto>> GetAllUsersAsync(UserSpecParams param)
        {
            var spec = new UserSearchSpec(param);
            var users = await _userRepository.GetAllWithSpecAsync(spec);

            return users.Select(u => new UserWithCoursesDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                CoursesCount = u.Enrollments
                    .Count(e =>
                        (!param.FromDate.HasValue || e.EnrolledAt >= param.FromDate.Value) &&
                        (!param.ToDate.HasValue || e.EnrolledAt <= param.ToDate.Value)),
                Courses = u.Enrollments
                    .Where(e =>
                        (!param.FromDate.HasValue || e.EnrolledAt >= param.FromDate.Value) &&
                        (!param.ToDate.HasValue || e.EnrolledAt <= param.ToDate.Value))
                    .Select(e => new UserCourseDto
                    {
                        EnrollmentId = e.Id,
                        Title = e.Planwork.ServiceTitle,
                        CoursePrice = e.Planwork.PlanCost,
                        EnrolledAt = e.EnrolledAt,
                        Attended = e.Attended
                    })
                    .ToList()
            }).ToList();
        }

        public async Task<IReadOnlyList<PlanworkWithUsersDto>> GetAllPlanworksAsync(PlanworkSpecParams param)
        {
            var spec = new PlanworkSearchSpec(param);
            var planworks = await _planworkRepository.GetAllWithSpecAsync(spec);

            return planworks.Select(p =>
            {
                var filteredEnrollments = p.Enrollments
                    .Where(e =>
                        (!param.FromDate.HasValue || e.EnrolledAt >= param.FromDate.Value) &&
                        (!param.ToDate.HasValue || e.EnrolledAt <= param.ToDate.Value))
                    .ToList();

                return new PlanworkWithUsersDto
                {
                    Id = p.ChildId,
                    ServiceTitle = p.ServiceTitle,
                    UsersCount = filteredEnrollments.Count,
                    TotalRevenue = (p.PlanCost ?? 0) * filteredEnrollments.Count,
                    Users = filteredEnrollments.Select(e => new UserEnrollmentDto
                    {
                        Username = e.User.Username,
                        Email = e.User.Email,
                        EnrolledAt = e.EnrolledAt
                    }).ToList()
                };
            }).ToList();
        }

        public async Task<AdminStatsDto> GetStatsAsync()
        {
            var coursesSpec = new PlanworkCount();
            var attendedSpec = new AttendedEnrollmentsSpec();

            var planworksSpec = new PlanworksWithEnrollmentsSpec();
            var planworks = await _planworkRepository.GetAllWithSpecAsync(planworksSpec);
            var today = DateTime.UtcNow.Date; // ← ده الناقص

            var totalRevenue = planworks
                .Sum(p => (p.PlanCost ?? 0) *
                    p.Enrollments.Count(e => e.EnrolledAt.Date >= today));

            var allRefunds = await _refundRepository.GetAllAsync();

            // ← فلتر المرتجعات من النهارده بس
            var totalRefunds = allRefunds
                .Where(r => (r.Status == "Approved" || r.Status == "Sent")
                         &&  r.RequestedAt.Date >= today)
                .Sum(r => r.Amount);


            return new AdminStatsDto
            {
                UsersCount = await _userRepository.CountAsync(),
                PlanworksCount = await _planworkRepository.GetCountAsync(coursesSpec),
                EnrollmentsCount = await _enrollmentRepository.CountAsync(),
                AttendanceCount = await _enrollmentRepository.GetCountAsync(attendedSpec),
                CertificatesCount = await _certificateRepository.CountAsync(),
                RefundsCount = await _refundRepository.CountAsync(),
                TotalRevenue = totalRevenue,
                TotalRefunds = totalRefunds,
                NetRevenue = totalRevenue - totalRefunds
            };
        }

        // ── جديد ─────────────────────────────────────────────────────────────
        public async Task<IReadOnlyList<PaidOrderDto>> GetPaidOrdersFromTodayAsync()
        {
            var today = DateTime.UtcNow.Date;
            var allOrders = await _orderRepository.GetAllAsync();

            return allOrders
                .Where(o => o.Status == OrderStatus.Paid && o.CreatedAt.Date >= today)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new PaidOrderDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    UserId = o.UserId,
                    UserName = o.User?.Username,
                    UserEmail = o.User?.Email,
                    TotalAmount = o.TotalAmount,
                    CreatedAt = o.CreatedAt,
                    CoursesTitles = o.Items
                        .Select(i => i.Planwork?.ServiceTitle ?? "")
                        .Where(t => !string.IsNullOrEmpty(t))
                        .ToList()
                }).ToList();
        }

        // ── باقي الميثودز كما هي ─────────────────────────────────────────────
        public async Task<bool> UploadCertificateAsync(UploadCertificateDto dto,string uploadsFolder)
        {
            if (dto.File == null || dto.File.Length == 0)
                return false;

            var exists = await _certificateRepository
                .AnyAsync(x =>
                    x.UserId == dto.UserId &&
                    x.PlanworkId == dto.PlanworkId);

            if (exists)
                return false;

            // ✅ upload to blob
            var blobName = await _blobStorage.UploadFileAsync(
                dto.File,
                Container,
                Folder);

            var certificate = new Certificate
            {
                UserId = dto.UserId,
                PlanworkId = dto.PlanworkId,

                // save blob url
                FileUrl =
                    $"https://acwebappbackup.blob.core.windows.net/icemt/certificates/{blobName}",

                FileName = dto.File.FileName,
                FileSizeBytes = dto.File.Length,
                UploadedAt = DateTime.UtcNow
            };

            await _certificateRepository.AddAsync(certificate);

            await _certificateRepository.SaveChangesAsync();

            return true;
        }
        public async Task<CertificateDto?> GetCertificateAsync(int userId, int planworkId)
        {
            var spec = new CertificateWithUserAndPlanworkSpec(userId, planworkId);
            var certificate = await _certificateRepository.GetByIdWithSpecAsync(spec);

            if (certificate == null)
                return null;

            return new CertificateDto
            {
                Id = certificate.Id,
                UserId = certificate.UserId,
                Username = certificate.User.Username,
                PlanworkId = certificate.PlanworkId,
                PlanworkTitle = certificate.Planwork.ServiceTitle,
                FileUrl = certificate.FileUrl,
                FileName = certificate.FileName,
                UploadedAt = certificate.UploadedAt
            };
        }

        public async Task<CertificateDto?> GetCertificateByClerkIdAsync(string clerkId, int planworkId)
        {
            var user = await _userRepository
                .GetByIdWithSpecAsync(new UserByClerkIdSpec(clerkId));

            if (user == null)
                return null;

            var spec = new CertificateWithUserAndPlanworkSpec(user.Id, planworkId);
            var certificate = await _certificateRepository.GetByIdWithSpecAsync(spec);

            if (certificate == null)
                return null;

            return new CertificateDto
            {
                Id = certificate.Id,
                UserId = certificate.UserId,
                Username = certificate.User.Username,
                PlanworkId = certificate.PlanworkId,
                PlanworkTitle = certificate.Planwork.ServiceTitle,
                FileUrl = certificate.FileUrl,
                FileName = certificate.FileName,
                UploadedAt = certificate.UploadedAt
            };
        }

        public async Task<bool> UpdateCertificateAsync(UpdateCertificateDto dto,string uploadsFolder)
        {
            var certificate =
                await _certificateRepository
                    .GetByIdAsync(dto.CertificateId);

            if (certificate == null)
                return false;

            // ✅ upload new file to blob
            var blobName = await _blobStorage.UploadFileAsync(
                dto.File,
                Container,
                Folder);

            certificate.FileUrl =
                $"https://acwebappbackup.blob.core.windows.net/icemt/certificates/{blobName}";

            certificate.FileName = dto.File.FileName;
            certificate.FileSizeBytes = dto.File.Length;
            certificate.UploadedAt = DateTime.UtcNow;

            _certificateRepository.Update(certificate);

            await _certificateRepository.SaveChangesAsync();

            return true;
        }
        public async Task<bool> DeleteCertificateAsync(int certificateId, string uploadsFolder)
        {
            var certificate = await _certificateRepository.GetByIdAsync(certificateId);

            if (certificate == null)
                return false;

            if (!string.IsNullOrEmpty(certificate.FileUrl))
            {
                var fileName = Path.GetFileName(certificate.FileUrl);
                var filePath = Path.Combine(uploadsFolder, fileName);

                if (File.Exists(filePath))
                    File.Delete(filePath);
            }

            _certificateRepository.Delete(certificate);
            await _certificateRepository.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateAttendanceAsync(int enrollmentId, bool attended)
        {
            var enrollment = await _enrollmentRepository.GetByIdAsync(enrollmentId);
            if (enrollment == null)
                return false;

            enrollment.Attended = attended;
            await _enrollmentRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IReadOnlyList<EnrollmentWithCertificateDto>> GetEnrollmentsWithCertificatesAsync()
        {
            var enrollments = await _enrollmentRepository.GetAllAsync();
            var result = new List<EnrollmentWithCertificateDto>();

            foreach (var e in enrollments)
            {
                var hasCertificate = await _certificateRepository.AnyAsync(
                    c => c.UserId == e.UserId && c.PlanworkId == e.PlanworkId);

                result.Add(new EnrollmentWithCertificateDto
                {
                    EnrollmentId = e.Id,
                    UserId = e.UserId,
                    Username = e.User.Username,
                    PlanworkId = e.PlanworkId,
                    PlanworkTitle = e.Planwork.ServiceTitle,
                    Attended = e.Attended,
                    HasCertificate = hasCertificate
                });
            }

            return result;
        }

        public async Task<IReadOnlyList<CertificateDto>> GetAllCertificatesAsync()
        {
            var certSpec = new AllCertificateWithUserAndPlanworkSpec();
            var certificates = await _certificateRepository.GetAllWithSpecAsync(certSpec);

            var certDict = certificates.ToDictionary(
                c => (c.UserId, c.PlanworkId),
                c => c);

            var enrollSpec = new EnrollmentWithUserAndPlanworkSpec();
            var enrollments = await _enrollmentRepository.GetAllWithSpecAsync(enrollSpec);

            return enrollments.Select(e =>
            {
                certDict.TryGetValue((e.UserId, e.PlanworkId), out var cert);

                return new CertificateDto
                {
                    Id = cert?.Id ?? 0,
                    UserId = e.UserId,
                    Username = e.User.Username,
                    PlanworkId = e.PlanworkId,
                    PlanworkTitle = e.Planwork.ServiceTitle,
                    FileUrl = cert?.FileUrl,
                    FileName = cert?.FileName,
                    UploadedAt = cert?.UploadedAt ?? DateTime.MinValue
                };
            }).ToList();
        }
    }
}