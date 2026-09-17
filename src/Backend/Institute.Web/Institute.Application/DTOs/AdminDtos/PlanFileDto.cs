using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.DTOs.AdminDtos
{
    public class PlanFileDto
    {
        public int PlanId { get; set; }

        public int FileId { get; set; }

        public string? FileTitle { get; set; }

        public string? FileName { get; set; }

        public int? FilePeriorty { get; set; }

        // optional
        public string? PlanworkName { get; set; }
    }
}
