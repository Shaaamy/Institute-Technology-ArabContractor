using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.DTOs.AdminDtos
{
    public class CreateBooksTypeDto
    {
        [Required]
        public string TypeName { get; set; }
    }
}
