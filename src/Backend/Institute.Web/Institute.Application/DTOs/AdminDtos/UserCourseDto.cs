using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.DTOs.AdminDtos
{
    public class UserCourseDto
    {
        public int EnrollmentId { get; set; } 
        public string Title { get; set; }
        public DateTime EnrolledAt { get; set; }
        public decimal? CoursePrice { get; set; }
        public bool Attended { get; set; } 
    }
}
