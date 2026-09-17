using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces.IService;
using Institute.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class AdminPlanworkController : ControllerBase
    {
        private readonly IPlanworkService _service;

        public AdminPlanworkController(IPlanworkService service)
        {
            _service = service;
        }

        // =========================
        // 🌳 GET TREE (الأهم)
        // =========================
        [HttpGet("tree")]
        public async Task<IActionResult> GetAdminTree()
        {
            var tree = await _service.GetTreeForAdminAsync();
            return Ok(tree);
        }

        // =========================
        // 🔍 GET BY ID
        // =========================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);

            if (result == null)
                return NotFound(new { message = "Planwork not found" });

            return Ok(result);
        }

        // =========================
        // ➕ CREATE
        // =========================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePlanworkDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _service.CreateAsync(dto);

                return Ok(new
                {
                    message = "Created successfully",
                    //data = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // =========================
        // ✏️ UPDATE
        // =========================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreatePlanworkDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updated = await _service.UpdateAsync(id, dto);

                if (!updated)
                    return NotFound(new { message = "Planwork not found" });

                return Ok(new
                {
                    message = "Updated successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // =========================
        // ❌ DELETE
        // =========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deleted = await _service.DeleteAsync(id);

                if (!deleted)
                    return NotFound(new { message = "Planwork not found" });

                return Ok(new
                {
                    message = "Deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    
    }
}
