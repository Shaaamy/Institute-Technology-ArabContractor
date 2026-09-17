using Institute.Domain.Entities;

namespace Institute.Application.Interfaces.IService
{
    public interface ICartService
    {
        Task<Cart> GetUserCartAsync(string clerkUserId);
        Task AddToCartAsync(string clerkUserId, int planworkId, bool isOnline = false);  // ✅
        Task RemoveFromCartAsync(string clerkUserId, int planworkId);
    }
}