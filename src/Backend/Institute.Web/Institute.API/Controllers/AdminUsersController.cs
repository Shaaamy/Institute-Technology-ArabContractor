using Institute.Domain.Entities;
using Institute.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Institute.API.Controllers
{
    [Authorize(Policy = "ManagerOnly")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminUsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminUsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.AppUsers
                .AsNoTracking()
                .Select(u => new
                {
                    u.Id,
                    u.ClerkUserId,
                    u.Username,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.IsManager
                })
                .OrderBy(u => u.FirstName)
                .ToListAsync();

            return Ok(users);
        }

        [HttpPatch("{userId}/manager")]
        public async Task<IActionResult> SetManager(
            int userId,
            [FromBody] SetManagerDto dto)
        {
            var user = await _context.AppUsers
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found");

            user.IsManager = dto.IsManager;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                user.Id,
                user.IsManager
            });
        }
    }

    public class SetManagerDto
    {
        public bool IsManager { get; set; }
    }
}