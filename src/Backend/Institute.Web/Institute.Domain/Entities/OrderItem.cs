using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }        // Navigation
        public int PlanworkId { get; set; }
        public Planwork Planwork { get; set; }        // Navigation
        public decimal Price { get; set; }
        public bool IsOnline { get; set; }


    }
}
