using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Institute.Application.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _context;
        private readonly IRepository<AppUser> _repository;

        public CurrentUserService(IHttpContextAccessor context,IRepository<AppUser> repository)

        {
            _context = context;
            _repository = repository;
        }

        public string? UserId =>
            _context.HttpContext?.User?.FindFirst("sub")?.Value;

        public async Task<bool> IsManagerAsync()
        {
            return await _repository.AnyAsync(x =>
                x.ClerkUserId == UserId &&
                x.IsManager);
        }
    }
}
