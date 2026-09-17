using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications;

namespace Institute.Application.Services
{
    public class CartService : ICartService
    {
        private readonly IRepository<AppUser> _userRepository;
        private readonly IRepository<Cart> _cartRepository;
        private readonly IRepository<CartItem> _cartItemRepository;
        private readonly IRepository<Planwork> _planworkRepository;

        public CartService(
            IRepository<AppUser> userRepository,
            IRepository<Cart> cartRepository,
            IRepository<CartItem> cartItemRepository,
            IRepository<Planwork> planworkRepository)
        {
            _userRepository = userRepository;
            _cartRepository = cartRepository;
            _cartItemRepository = cartItemRepository;
            _planworkRepository = planworkRepository;
        }

        public async Task<Cart> GetUserCartAsync(string clerkUserId)
        {
            var userSpec = new BaseSpecification<AppUser>(u => u.ClerkUserId == clerkUserId && !u.IsDeleted);
            var user = (await _userRepository.GetAllWithSpecAsync(userSpec)).FirstOrDefault();

            if (user == null)
                throw new Exception("User not found");

            var cartSpec = new BaseSpecification<Cart>(c => c.UserId == user.Id && !c.IsCheckedOut);
            cartSpec.AddInclude(c => c.Items);
            cartSpec.AddInclude("Items.Planwork");
            cartSpec.AddInclude("Items.Planwork.Files");

            var cart = (await _cartRepository.GetAllWithSpecAsync(cartSpec)).FirstOrDefault();

            if (cart == null)
            {
                cart = new Cart { UserId = user.Id, CreatedAt = DateTime.UtcNow };
                await _cartRepository.AddAsync(cart);
                await _cartRepository.SaveChangesAsync();
            }

            return cart;
        }

        public async Task AddToCartAsync(string clerkUserId, int planworkId, bool isOnline = false)
        {
            var cart = await GetUserCartAsync(clerkUserId);

            var itemSpec = new BaseSpecification<CartItem>(
                i => i.CartId == cart.Id && i.PlanworkId == planworkId);

            var existingItem = (await _cartItemRepository.GetAllWithSpecAsync(itemSpec))
                .FirstOrDefault();

            if (existingItem != null)
            {
                // ✅ لو اليوزر غيّر النوع — حدّث السعر والنوع
                if (existingItem.IsOnline != isOnline)
                {
                    var planworkForUpdate = await _planworkRepository.GetByIdAsync(planworkId);
                    existingItem.IsOnline = isOnline;
                    existingItem.Price = isOnline
                        ? (planworkForUpdate?.OnlineCost ?? planworkForUpdate?.PlanCost ?? 0)
                        : (planworkForUpdate?.PlanCost ?? 0);
                    _cartItemRepository.Update(existingItem);
                    await _cartItemRepository.SaveChangesAsync();
                }
                return;
            }

            var planwork = await _planworkRepository.GetByIdAsync(planworkId);
            if (planwork == null)
                throw new Exception("Course not found");

            // ✅ السعر يتحدد حسب النوع
            var price = isOnline
                ? (planwork.OnlineCost ?? planwork.PlanCost ?? 0)
                : (planwork.PlanCost ?? 0);

            await _cartItemRepository.AddAsync(new CartItem
            {
                CartId = cart.Id,
                PlanworkId = planworkId,
                Price = price,
                IsOnline = isOnline  // ✅
            });

            await _cartItemRepository.SaveChangesAsync();
        }

        public async Task RemoveFromCartAsync(string clerkUserId, int planworkId)
        {
            var cart = await GetUserCartAsync(clerkUserId);

            var itemSpec = new BaseSpecification<CartItem>(
                i => i.CartId == cart.Id && i.PlanworkId == planworkId);

            var item = (await _cartItemRepository.GetAllWithSpecAsync(itemSpec)).FirstOrDefault();
            if (item == null) return;

            _cartItemRepository.Delete(item);
            await _cartItemRepository.SaveChangesAsync();
        }
    }
}