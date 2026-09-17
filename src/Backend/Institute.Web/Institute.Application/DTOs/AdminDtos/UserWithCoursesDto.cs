using Institute.Application.DTOs.AdminDtos;

namespace Institute.API.DTOs.AdminDtos
{
    public class UserWithCoursesDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }

        public int CoursesCount { get; set; }
        public List<UserCourseDto> Courses { get; set; }
    }
}
