using Institute.API.DTOs.AdminDtos;
using Institute.Application.DTOs.AdminDtos;
using Institute.Domain.specifications.AdminSpec.Course;
using Institute.Domain.specifications.AdminSpec.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface IAdminService
    {
        Task<IReadOnlyList<UserWithCoursesDto>> GetAllUsersAsync(UserSpecParams param);
        Task<CertificateDto?> GetCertificateByClerkIdAsync(string clerkId, int planworkId);
        Task<IReadOnlyList<PlanworkWithUsersDto>> GetAllPlanworksAsync(PlanworkSpecParams param);
        Task<AdminStatsDto> GetStatsAsync();
        Task<bool> UploadCertificateAsync(UploadCertificateDto dto, string uploadsFolder);
        Task<bool> UpdateAttendanceAsync(int enrollmentId, bool attended);
        Task<IReadOnlyList<CertificateDto>> GetAllCertificatesAsync();
        Task<CertificateDto?> GetCertificateAsync(int userId, int planworkId);
        Task<bool> UpdateCertificateAsync(UpdateCertificateDto dto, string uploadsFolder);
        Task<bool> DeleteCertificateAsync(int certificateId, string uploadsFolder);
        Task<IReadOnlyList<EnrollmentWithCertificateDto>> GetEnrollmentsWithCertificatesAsync();
        Task<IReadOnlyList<PaidOrderDto>> GetPaidOrdersFromTodayAsync(); // ← جديد
    }
}
