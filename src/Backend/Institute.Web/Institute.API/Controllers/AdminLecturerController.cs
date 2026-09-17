using Institute.Application.DTOs;
using Institute.Application.Interfaces.IService;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public class AdminLecturerController : ControllerBase
    {
        private readonly ILecturerService _service;

        public AdminLecturerController(ILecturerService service)
        {
            _service = service;
        }

        // ── GET ALL ───────────────────────────────────────────────────────────
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        // ── GET BY ID ─────────────────────────────────────────────────────────
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // ── CREATE ────────────────────────────────────────────────────────────
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LecturerCreateUpdateDto dto)
        {
            var created = await _service.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = created.Id },
                created);
        }

        // ── UPDATE ────────────────────────────────────────────────────────────
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] LecturerCreateUpdateDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);

            if (updated == null)
                return NotFound();

            return Ok(updated);
        }

        // ── DELETE ────────────────────────────────────────────────────────────
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);

            if (!result)
                return NotFound();

            return Ok(new { message = "Deleted successfully" });
        }

        // ── UPLOAD PHOTO ──────────────────────────────────────────────────────
        [HttpPost("{id}/photo")]
        public async Task<IActionResult> UploadPhoto(
            int id,
            IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "File is required" });

            var imageUrl = await _service.UploadPhotoAsync(id, file, "");

            if (imageUrl == null)
                return NotFound();

            return Ok(new { imageUrl });
        }
    }
}