using Institute.API.DTOs;
using Institute.API.DTOs.AdminDtos;
using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications.AdminSpec.Course;
using Institute.Domain.specifications.AdminSpec.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly IWebHostEnvironment _env;

        public AdminController(IAdminService adminService, IWebHostEnvironment env)
        {
            _adminService = adminService;
            _env = env;
        }

        // GET: api/admin/users?keyword=ahmed
        [HttpGet("users")]
        public async Task<ActionResult<IReadOnlyList<UserWithCoursesDto>>> GetUsers(
            [FromQuery] UserSpecParams param)
        {
            return Ok(await _adminService.GetAllUsersAsync(param));
        }

        // GET: api/admin/planworks
        [HttpGet("planworks")]
        public async Task<ActionResult<IReadOnlyList<PlanworkWithUsersDto>>> GetPlanworks(
            [FromQuery] PlanworkSpecParams param)
        {
            return Ok(await _adminService.GetAllPlanworksAsync(param));
        }

        // GET: api/admin/stats
        [HttpGet("stats")]
        public async Task<ActionResult<AdminStatsDto>> GetStatistics()
        {
            var stats = await _adminService.GetStatsAsync();
            return Ok(stats);
        }

        // ── جديد ──────────────────────────────────────────────────────────────
        /// <summary>
        /// GET /api/admin/paid-orders
        /// كل الأوردرات المدفوعة (Status = 1) من النهارده للمستقبل
        /// </summary>
        [HttpGet("paid-orders")]
        public async Task<ActionResult<IReadOnlyList<PaidOrderDto>>> GetPaidOrders()
        {
            var result = await _adminService.GetPaidOrdersFromTodayAsync();
            return Ok(result);
        }

        // ── Certificates ──────────────────────────────────────────────────────
        [HttpPost("upload")]
        public async Task<IActionResult> UploadCertificate([FromForm] UploadCertificateDto dto)
        {
            var result = await _adminService.UploadCertificateAsync(dto, "");

            if (!result)
                return BadRequest("Certificate already uploaded");

            return Ok(new { message = "Certificate uploaded successfully" });
        }

        [HttpGet("enrollments-with-certificates")]
        public async Task<ActionResult<IReadOnlyList<EnrollmentWithCertificateDto>>> GetEnrollmentsWithCertificates()
        {
            var result = await _adminService.GetEnrollmentsWithCertificatesAsync();
            return Ok(result);
        }

        [HttpPatch("enrollments/{id}/attendance")]
        public async Task<IActionResult> UpdateAttendance(int id, [FromBody] bool attended)
        {
            var result = await _adminService.UpdateAttendanceAsync(id, attended);
            if (!result)
                return NotFound(new { message = "Enrollment not found" });

            return Ok(new { message = "Attendance updated successfully" });
        }

        [HttpGet("certificates")]
        public async Task<ActionResult<IReadOnlyList<CertificateDto>>> GetCertificates()
        {
            var result = await _adminService.GetAllCertificatesAsync();
            return Ok(result);
        }

        [HttpGet("certificates/{userId}/{planworkId}")]
        public async Task<ActionResult<CertificateDto>> GetCertificate(int userId, int planworkId)
        {
            var result = await _adminService.GetCertificateAsync(userId, planworkId);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("certificates/{planworkId}")]
        public async Task<IActionResult> GetMyCertificate(int planworkId)
        {
            var clerkId = User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(clerkId))
                return Unauthorized();

            var cert = await _adminService.GetCertificateByClerkIdAsync(clerkId, planworkId);

            if (cert == null)
                return NotFound();

            return Ok(cert);
        }

        [HttpPut("certificates")]
        public async Task<IActionResult> UpdateCertificate([FromForm] UpdateCertificateDto dto)
        {
            var result = await _adminService.UpdateCertificateAsync(dto, "");
            if (!result)
                return NotFound("Certificate not found");

            return Ok(new { message = "Certificate updated successfully" });
        }

        [HttpDelete("certificates/{id}")]
        public async Task<IActionResult> DeleteCertificate(int id)
        {
            var result = await _adminService.DeleteCertificateAsync(id, "");

            if (!result)
                return NotFound("Certificate not found");

            return Ok(new
            {
                message = "Certificate deleted successfully"
            });
        }

        //[HttpGet("certificates/download/{fileName}")]
        //[AllowAnonymous]
        //public IActionResult DownloadCertificate(string fileName)
        //{
        //    var filePath = Path.Combine(
        //        "D:\\home\\site\\userfiles\\certificates",
        //        fileName
        //    );

        //    if (!System.IO.File.Exists(filePath))
        //        return NotFound();

        //    var contentType = Path.GetExtension(fileName).ToLower() switch
        //    {
        //        ".pdf" => "application/pdf",
        //        ".png" => "image/png",
        //        ".jpg" => "image/jpeg",
        //        ".jpeg" => "image/jpeg",
        //        _ => "application/octet-stream"
        //    };

        //    Response.Headers.Add("Content-Disposition", $"inline; filename={fileName}");
        //    var fileBytes = System.IO.File.ReadAllBytes(filePath);
        //    return File(fileBytes, contentType);
        //}
    }
}