using Institute.API.DTOs;
using Institute.API.Helpers;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.Enums;
using Institute.Domain.specifications.CourseSpec;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly IRepository<Planwork> _planRepo;
        private readonly IRepository<PlanFile> _fileRepo;
        private readonly IRepository<Enrollment> _enrollmentRepo;
        private readonly IClerkService _clerkService;
        private readonly IRepository<AppUser> _userRepo;
        private readonly ICategoryService _categoryService;
        private readonly IRepository<Order> _orderRepo;

        public CourseController(
            IRepository<Planwork> planRepo,
            IRepository<PlanFile> fileRepo,
            IRepository<Enrollment> enrollmentRepo,
            IClerkService clerkService,
            IRepository<AppUser> userRepo,
            ICategoryService categoryService,
            IRepository<Order> orderRepo)
        {
            _planRepo = planRepo;
            _fileRepo = fileRepo;
            _enrollmentRepo = enrollmentRepo;
            _clerkService = clerkService;
            _userRepo = userRepo;
            _categoryService = categoryService;
            _orderRepo = orderRepo;
        }

        // ══════════════════════════════════════════════════════════════
        // GET /api/course/programs/{slug}/courses
        // بيجيب كل الكورسات اللي تحت برنامج معين عن طريق الـ Slug بتاعه
        // بيشتغل Recursive عشان يجمع الكورسات من كل المستويات
        // سواء كانت مباشرة تحت البرنامج أو تحت محاور/عناوين تنظيمية
        // ══════════════════════════════════════════════════════════════
        [HttpGet("programs/{slug}/courses")]
        public async Task<IActionResult> GetProgramCourses(string slug)
        {
            // جيب كل الـ Planworks والـ Files مرة واحدة من الـ DB
            var planworks = (await _planRepo.GetAllAsync()).ToList();
            var files = (await _fileRepo.GetAllAsync()).ToList();

            // دور على البرنامج بالـ Slug — لو مش موجود رجع 404
            var program = planworks.FirstOrDefault(x => x.Slug == slug);
            if (program == null)
                return NotFound();

            var programId = program.ChildId;

            // جمع الكورسات Recursive من كل المستويات
            var courses = GetCoursesRecursive(planworks, files, programId);

            return Ok(new ProgramCoursesDto
            {
                ProgramId = program.ChildId,
                Slug = program.Slug,
                ProgramName = program.ServiceTitle,
                Courses = courses
                    .OrderBy(c => c.Id)
                    .ToList()
            });
        }

        // ══════════════════════════════════════════════════════════════
        // HELPER — GetCoursesRecursive (Entry Point)
        // نقطة الدخول للـ Recursive — بتبدأ بـ HashSet فاضي
        // الـ HashSet ده بيحمي من الـ Infinite Loop
        // لو في ChildId اتزار قبل كده بيتجاهله
        // ══════════════════════════════════════════════════════════════
        private List<CourseCardDto> GetCoursesRecursive(
            List<Planwork> planworks,
            List<PlanFile> files,
            int parentId)
        {
            return GetCoursesRecursive(
                planworks,
                files,
                parentId,
                new HashSet<int>()
            );
        }

        // ══════════════════════════════════════════════════════════════
        // HELPER — GetCoursesRecursive (Core Logic)
        // بتجمع الكورسات من مستوى معين وكل المستويات اللي تحته
        // كورس حقيقي = DetailsFlag: false + CourseDate != null
        // عنوان تنظيمي = CourseDate == null (بيتنزل فيه Recursive)
        // ══════════════════════════════════════════════════════════════
        private List<CourseCardDto> GetCoursesRecursive(
            List<Planwork> planworks,
            List<PlanFile> files,
            int parentId,
            HashSet<int> visited)
        {
            var result = new List<CourseCardDto>();

            // حماية من الـ Infinite Loop
            if (visited.Contains(parentId))
                return result;

            visited.Add(parentId);

            // جيب الكورسات المباشرة تحت الـ parentId
            var directCourses = planworks
                .Where(x =>
                    x.ParentId == parentId &&
                    x.DetailsFlag == false &&
                    x.CourseDate != null
                )
                .OrderBy(x => x.Priority)
                .Select(c => new CourseCardDto
                {
                    Id = c.ChildId,
                    Slug = c.Slug,
                    Title = c.ServiceTitle,
                    Place = c.CoursePlace,
                    Date = c.CourseDate,
                    Description = c.CourseDesc,
                    Cost = c.PlanCost,
                    IsOnline = c.IsOnline,
                    OnlineCost = c.OnlineCost
                })
                .ToList();

            result.AddRange(directCourses);

            // جيب العناوين التنظيمية (اللي مالهاش CourseDate)
            // وانزل فيها Recursive عشان تجيب الكورسات اللي جوّاها
            var childrenIds = planworks
                .Where(x =>
                    x.ParentId == parentId &&
                    x.CourseDate == null
                )
                .Select(x => x.ChildId)
                .ToList();

            foreach (var childId in childrenIds)
            {
                result.AddRange(
                    GetCoursesRecursive(planworks, files, childId, visited)
                );
            }

            return result;
        }

        // ══════════════════════════════════════════════════════════════
        // GET /api/course/{slug}
        // بيجيب تفاصيل كورس واحد كامل عن طريق الـ Slug بتاعه
        // بيرجع كل البيانات + الملفات المرفقة مرتبة بالـ Priority
        // ══════════════════════════════════════════════════════════════
        [HttpGet("{slug}")]
        public async Task<IActionResult> GetCourseById(string slug)
        {
            var planworks = (await _planRepo.GetAllAsync()).ToList();
            var files = (await _fileRepo.GetAllAsync()).ToList();

            // دور على الكورس بالـ Slug
            var course = planworks.FirstOrDefault(x =>
                x.Slug == slug &&
                x.DetailsFlag == false &&
                x.CourseDate != null
            );

            if (course == null)
                return NotFound();

            // جيب الملفات المرتبطة بالكورس ده مرتبة بالـ Priority
            var courseFiles = files
                .Where(f => f.PlanId == course.ChildId)
                .OrderBy(f => f.FilePeriorty)
                .Select(f => new CourseFileDto
                {
                    Title = f.FileTitle,
                    FileName = f.FileName
                })
                .ToList();

            var dto = new CourseDto
            {
                Id = course.ChildId,
                Slug = course.Slug,
                Title = course.ServiceTitle,
                Description = course.CourseDesc,
                Place = course.CoursePlace,
                Date = course.CourseDate,
                Days = course.CourseDays,
                Content = course.CourseContent,
                Cost = course.PlanCost,
                Files = courseFiles,
                IsOnline = course.IsOnline,
                OnlineCost = course.OnlineCost
            };

            return Ok(dto);
        }

        // ══════════════════════════════════════════════════════════════
        // GET /api/course/latest
        // بيجيب آخر 20 كورس متاحين
        // بيستخدم الـ CategoryService اللي فيها Logic الترتيب والفلترة
        // ══════════════════════════════════════════════════════════════
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestCourses()
        {
            var courses = await _categoryService.GetLatestCoursesAsync(20);
            return Ok(courses);
        }

        // ══════════════════════════════════════════════════════════════
        // GET /api/course/my-courses
        // بيجيب كل الكورسات اللي اليوزر المسجل دخول سجل فيها
        // سواء كانت مدفوعة (ليها OrderId) أو مجانية (OrderId = null)
        // ══════════════════════════════════════════════════════════════
        [HttpGet("my-courses")]
        public async Task<IActionResult> GetMyCourses()
        {
            // جيب الـ User الحالي من Clerk
            var clerkUserId = _clerkService.GetAuthenticatedUserId(User);
            if (clerkUserId == null)
                return Unauthorized();

            var appUser = await _userRepo.GetByClerkIdAsync(clerkUserId);
            if (appUser == null)
                return NotFound("User not found in local DB");

            // جيب كل الـ Enrollments بتاعت اليوزر ده
            var allEnrollments = await _enrollmentRepo.GetAllAsync();
            var userEnrollments = allEnrollments
                .Where(e => e.UserId == appUser.Id)
                .ToList();

            var allPlanworks = (await _planRepo.GetAllAsync()).ToList();

            // عمل Join يدوي بين Enrollment و Planwork
            // IsFree = true لو مفيش OrderId (كورس مجاني)
            var courses = userEnrollments
                .Select(e =>
                {
                    var plan = allPlanworks.FirstOrDefault(p => p.ChildId == e.PlanworkId);
                    if (plan == null) return null;
                    return new
                    {
                        ChildId = plan.ChildId,
                        CoursePlace = plan.CoursePlace,
                        CourseDate = plan.CourseDate,
                        ServiceTitle = plan.ServiceTitle,
                        Slug = plan.Slug,
                        EnrolledAt = e.EnrolledAt,
                        OrderId = e.OrderId,
                        Cost = plan.PlanCost,
                        IsFree = e.OrderId == null,
                        IsOnline = plan.IsOnline,
                        OnlineCost = plan.OnlineCost
                    };
                })
                .Where(c => c != null)
                .ToList();

            return Ok(courses);
        }

        // ══════════════════════════════════════════════════════════════
        // POST /api/course/enroll-free/{planworkId}
        // [Authorize] — محتاج يكون اليوزر مسجل دخول
        // بيسجل اليوزر في كورس مجاني مباشرة من غير Cart أو Payment
        // بيعمل Order وهمي بـ 0 جنيه عشان الـ DB مش بتقبل OrderId = null
        // ══════════════════════════════════════════════════════════════
        [HttpPost("enroll-free/{planworkId}")]
        [Authorize]
        public async Task<IActionResult> EnrollInFreeCourse(int planworkId)
        {
            // جيب الـ User الحالي
            var clerkUserId = _clerkService.GetAuthenticatedUserId(User);
            if (clerkUserId == null)
                return Unauthorized();

            var appUser = await _userRepo.GetByClerkIdAsync(clerkUserId);
            if (appUser == null)
                return NotFound("المستخدم غير موجود.");

            // تحقق إن الكورس موجود وفعلاً مجاني (PlanCost = 0 أو null)
            var planworks = (await _planRepo.GetAllAsync()).ToList();
            var course = planworks.FirstOrDefault(p =>
                p.ChildId == planworkId &&
                p.CourseDate != null &&
                p.DetailsFlag == false &&
                (p.PlanCost == null || p.PlanCost == 0));

            if (course == null)
                return BadRequest(new { message = "الكورس غير موجود أو غير مجاني." });

            // منع التسجيل المكرر في نفس الكورس
            var alreadyEnrolled = await _enrollmentRepo.AnyAsync(
                e => e.UserId == appUser.Id && e.PlanworkId == planworkId);

            if (alreadyEnrolled)
                return Ok(new { message = "أنت مسجل في هذا الكورس بالفعل.", alreadyEnrolled = true });

            // أنشئ Order وهمي بـ 0 جنيه
            var freeOrder = new Order
            {
                UserId = appUser.Id,
                TotalAmount = 0,
                Status = OrderStatus.Paid,
                OrderNumber = Guid.NewGuid().ToString("N")
            };
            await _orderRepo.AddAsync(freeOrder);
            await _orderRepo.SaveChangesAsync();

            // أنشئ الـ Enrollment مرتبط بالـ Order الوهمي
            await _enrollmentRepo.AddAsync(new Enrollment
            {
                UserId = appUser.Id,
                PlanworkId = planworkId,
                OrderId = freeOrder.Id,
                EnrolledAt = DateTime.UtcNow
            });
            await _enrollmentRepo.SaveChangesAsync();

            return Ok(new
            {
                message = "تم تسجيلك في الكورس المجاني بنجاح.",
                alreadyEnrolled = false,
                courseTitle = course.ServiceTitle,
                courseSlug = course.Slug
            });
        }
    }
}