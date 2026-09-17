using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.DTOs.AdminDtos
{
    public class PlanworkTreeDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Slug { get; set; }

        public List<PlanworkTreeDto> Children { get; set; } = new();
    }
}
