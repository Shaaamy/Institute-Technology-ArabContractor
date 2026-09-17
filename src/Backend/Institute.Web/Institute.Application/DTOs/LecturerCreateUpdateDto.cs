using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.DTOs
{
    public class LecturerCreateUpdateDto
    {
        public string Name { get; set; } = null!;
        public string? Specialty { get; set; }   // → LecturerMainEdu في الـ Entity
        public string? Email { get; set; }
        public string? Phone { get; set; }       // → Telephone في الـ Entity
        public string? Courses { get; set; }     // → LecturerCourse في الـ Entity
        public string? Level { get; set; }       // → LecturerEdu في الـ Entity
        public string? Details { get; set; }     // → LecturerDetails في الـ Entity
    }
}
