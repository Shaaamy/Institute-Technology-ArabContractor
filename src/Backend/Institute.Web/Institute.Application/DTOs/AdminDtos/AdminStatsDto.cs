using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.DTOs.AdminDtos
{
    public class AdminStatsDto
    {
        public int UsersCount { get; set; }
        public int PlanworksCount { get; set; }
        public int EnrollmentsCount { get; set; }
        public int AttendanceCount { get; set; }
        public int CertificatesCount { get; set; }
        public int RefundsCount { get; set; }

        public decimal TotalRevenue { get; set; }
        public decimal TotalRefunds { get; set; }
        public decimal NetRevenue { get; set; }


    }
}
