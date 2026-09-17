using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.DTOs.AdminDtos
{
    public class CreatePlanFileDto
    {
        public int PlanId { get; set; }

        public string? FileTitle { get; set; }

        public int? FilePeriorty { get; set; }

        public IFormFile File { get; set; } = null!;
    }
}
