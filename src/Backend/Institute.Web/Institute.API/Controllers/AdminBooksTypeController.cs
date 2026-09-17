using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces.IService;
using Institute.Application.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    //[HasPermission("Books")]
    [Route("api/admin/[controller]")]
    [ApiController]
    public class AdminBooksTypeController : ControllerBase
    {
        private readonly IBooksTypeService _service;

        public AdminBooksTypeController(IBooksTypeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateBooksTypeDto dto)
            => Ok(await _service.CreateAsync(dto));

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateBooksTypeDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated) return NotFound();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return Ok();
        }
    }
}
