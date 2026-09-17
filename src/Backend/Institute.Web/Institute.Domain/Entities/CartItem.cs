using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.Entities
{
    public class CartItem
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        public Cart Cart { get; set; }        // Navigation
        public int PlanworkId { get; set; }
        public Planwork Planwork { get; set; }        // Navigation
        public decimal Price { get; set; }
        public bool IsOnline { get; set; }

    }
}
