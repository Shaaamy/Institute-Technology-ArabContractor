using Institute.Application.Interfaces.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Authorize]
    [Route("api/UserPermissions")]
    [ApiController]
    public class UserPermissionsMeController : ControllerBase
    {
        private readonly IUserPermissionService _permissionService;

        public UserPermissionsMeController(IUserPermissionService permissionService)
        {
            _permissionService = permissionService;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyPermissions()
        {
            var clerkId = User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(clerkId))
                return Unauthorized();

            var (isManager, permissions) = await _permissionService.GetMyRoleAsync(clerkId);

            return Ok(new
            {
                isManager,
                permissions
            });
        }
    }
}