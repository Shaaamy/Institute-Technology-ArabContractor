using System.ComponentModel.DataAnnotations;

namespace Institute.Application.DTOs.AdminDtos
{
    public class CreateBookDto
    {
        [Required, MaxLength(200)]
        public string BookName { get; set; }

        [MaxLength(150)]
        public string Author { get; set; }

        public int? BookDate { get; set; }


        [Required]
        public int TypeId { get; set; }
    }
}
