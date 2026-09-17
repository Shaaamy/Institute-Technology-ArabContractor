using Institute.API.DTOs;
using Institute.Application.Interfaces.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Authorize(Policy = "ManagerOnly")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserPermissionsController : ControllerBase
    {
        private readonly IUserPermissionService _service;

        public UserPermissionsController(IUserPermissionService service)
        {
            _service = service;
        }

        [HttpPost("assign")]
        public async Task<IActionResult> Assign([FromBody] AssignPermissionDto dto)
        {
            await _service.AssignAsync(dto.UserId, dto.PermissionId);
            return Ok("Permission assigned");
        }

        [HttpDelete("remove")]
        public async Task<IActionResult> Remove([FromQuery] int userId, [FromQuery] int permissionId)
        {
            await _service.RemoveAsync(userId, permissionId);
            return Ok("Permission removed");
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserPermissions(int userId)
        {
            var result = await _service.GetUserPermissionsAsync(userId);
            return Ok(result);
        }
    }
}
