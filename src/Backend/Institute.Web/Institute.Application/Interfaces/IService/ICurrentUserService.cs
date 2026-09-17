using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface ICurrentUserService
    {
        string? UserId { get; }
        Task<bool> IsManagerAsync();

    }
}
