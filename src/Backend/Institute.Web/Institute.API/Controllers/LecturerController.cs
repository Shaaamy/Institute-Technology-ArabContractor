using Institute.Application.Interfaces.IService;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LecturerController : ControllerBase
    {
        private readonly ILecturerService _service;

        public LecturerController(ILecturerService service)
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
    }
}