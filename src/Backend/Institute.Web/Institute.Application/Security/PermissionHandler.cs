using Institute.Application.Interfaces.IService;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Security
{
    public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly IUserPermissionService _service;

        public PermissionHandler(IUserPermissionService service)
        {
            _service = service;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            PermissionRequirement requirement)
        {
            var clerkId = context.User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(clerkId))
                return;

            var permissions = await _service.GetPermissionsByClerkId(clerkId);

            if (permissions.Contains(requirement.Permission))
            {
                context.Succeed(requirement);
            }
        }
    }
}
