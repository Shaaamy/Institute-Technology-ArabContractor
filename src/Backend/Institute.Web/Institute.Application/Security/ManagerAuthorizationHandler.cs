using Institute.Application.Interfaces.IService;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Security
{
    public class ManagerAuthorizationHandler : AuthorizationHandler<ManagerRequirement>
    {
        private readonly ICurrentUserService _currentUser;

        public ManagerAuthorizationHandler(
            ICurrentUserService currentUser)
        {
            _currentUser = currentUser;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            ManagerRequirement requirement)
        {
            if (await _currentUser.IsManagerAsync())
            {
                context.Succeed(requirement);
            }
        }
    }
}
