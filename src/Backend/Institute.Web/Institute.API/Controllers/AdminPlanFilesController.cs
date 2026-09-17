using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Route("api/admin/[controller]")]
    [ApiController]
    public class AdminPlanFilesController : ControllerBase
    {
        private readonly IPlanFileService _service;

        public AdminPlanFilesController(IPlanFileService service)
        {
            _service = service;
        }

        [HttpGet("{planId}")]
        public async Task<IActionResult> GetFiles(int planId)
        {
            var result = await _service.GetFilesAsync(planId);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Add(
            [FromForm] CreatePlanFileDto dto)
        {
            await _service.AddAsync(dto);

            return Ok(new
            {
                message = "File uploaded successfully"
            });
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(
            int planId,
            int fileId)
        {
            await _service.DeleteAsync(planId, fileId);

            return Ok();
        }
    }
}
