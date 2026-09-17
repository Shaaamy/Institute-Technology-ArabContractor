using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.DTOs.AdminDtos
{
    public class BookDto
    {
        public int BookId { get; set; }
        public string BookName { get; set; }
        public string? Author { get; set; }
        public int? BookDate { get; set; }

        public int TypeId { get; set; }
        public string? TypeName { get; set; }
    }
}
