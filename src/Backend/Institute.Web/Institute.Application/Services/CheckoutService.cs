using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.Enums;
using Institute.Domain.specifications;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class CheckoutService : ICheckoutService
    {
        private readonly IRepository<AppUser> _userRepository;
        private readonly IRepository<Cart> _cartRepository;
        private readonly IRepository<Order> _orderRepository;
        private readonly IRepository<OrderItem> _orderItemRepository;
        private readonly IRepository<Payment> _paymentRepository;
        private readonly IRepository<Enrollment> _enrollmentRepository;

        public CheckoutService(
            IRepository<AppUser> userRepository,
            IRepository<Cart> cartRepository,
            IRepository<Order> orderRepository,
            IRepository<OrderItem> orderItemRepository,
            IRepository<Payment> paymentRepository,
            IRepository<Enrollment> enrollmentRepository)
        {
            _userRepository = userRepository;
            _cartRepository = cartRepository;
            _orderRepository = orderRepository;
            _orderItemRepository = orderItemRepository;
            _paymentRepository = paymentRepository;
            _enrollmentRepository = enrollmentRepository;
        }

        // ── GET USER ──────────────────────────────────────────────────
        public async Task<AppUser> GetUserByClerkIdAsync(string clerkUserId)
        {
            var spec = new BaseSpecification<AppUser>(u => u.ClerkUserId == clerkUserId);
            return (await _userRepository.GetAllWithSpecAsync(spec)).FirstOrDefault();
        }

        // ── GET ORDER ─────────────────────────────────────────────────
        public async Task<Order?> GetOrderByIdAsync(int orderId)
        {
            var spec = new BaseSpecification<Order>(o => o.Id == orderId);
            spec.AddInclude(o => o.Items);
            spec.AddInclude("Items.Planwork");
            return (await _orderRepository.GetAllWithSpecAsync(spec)).FirstOrDefault();
        }

        // ── CREATE ORDER  [W1 FIX: single DB transaction] ─────────────
        public async Task<Order> CreateOrderAsync(int userId)
        {
            // Read cart BEFORE the transaction (read-only, no lock needed)
            var cartSpec = new BaseSpecification<Cart>(c => c.UserId == userId);
            cartSpec.AddInclude(c => c.Items);
            var allCarts = await _cartRepository.GetAllWithSpecAsync(cartSpec);

            var cart = allCarts
                .Where(c => c.Items.Any())
                .OrderByDescending(c => c.Id)
                .FirstOrDefault();

            if (cart == null || !cart.Items.Any())
                throw new Exception("Cart is empty");

            var total = cart.Items.Sum(i => i.Price);

            // ── Open a single transaction covering ALL writes ──────────
            await using var tx = await _orderRepository.BeginTransactionAsync();
            try
            {
                // 1️⃣ Cancel old pending orders
                var pendingSpec = new BaseSpecification<Order>(
                    o => o.UserId == userId && o.Status == OrderStatus.Pending);
                var pendingOrders = await _orderRepository.GetAllWithSpecAsync(pendingSpec);

                foreach (var old in pendingOrders)
                {
                    old.Status = OrderStatus.Cancelled;
                    _orderRepository.Update(old);
                }

                // 2️⃣ Create new Order
                var order = new Order
                {
                    UserId = userId,
                    TotalAmount = total,
                    Status = OrderStatus.Pending,
                    CreatedAt = DateTime.UtcNow
                };
                await _orderRepository.AddAsync(order);
                await _orderRepository.SaveChangesAsync(); // flush to get order.Id

                // 3️⃣ Add OrderItems
                foreach (var item in cart.Items)
                {
                    await _orderItemRepository.AddAsync(new OrderItem
                    {
                        OrderId = order.Id,
                        PlanworkId = item.PlanworkId,
                        Price = item.Price,
                        IsOnline = item.IsOnline
                    });
                }

                // 4️⃣ Create Payment record
                await _paymentRepository.AddAsync(new Payment
                {
                    OrderId = order.Id,
                    Amount = total,
                    Method = PaymentMethod.Visa,
                    Status = PaymentStatus.Pending,
                    CreatedAt = DateTime.UtcNow
                });

                await _orderRepository.SaveChangesAsync();
                await tx.CommitAsync();

                return order;
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

        // ── UPDATE ORDER ──────────────────────────────────────────────
        public async Task UpdateOrderAsync(Order order)
        {
            if (order == null) throw new ArgumentNullException(nameof(order));
            _orderRepository.Update(order);
            await _orderRepository.SaveChangesAsync();
        }

        public async Task UpdateOrderGatewayDataAsync(Order order)
        {
            _orderRepository.Update(order);
            await _orderRepository.SaveChangesAsync();
        }

        // ── MARK AS PAID  [W5 FIX: single DB transaction] ─────────────
        public async Task<Payment> MarkOrderAsPaidAsync(
            Order order, string transactionRef, string gatewayResponse)
        {
            if (order == null) throw new ArgumentNullException(nameof(order));

            var paymentSpec = new BaseSpecification<Payment>(p => p.OrderId == order.Id);
            var payment = (await _paymentRepository.GetAllWithSpecAsync(paymentSpec))
                .FirstOrDefault()
                ?? throw new Exception("Payment record not found for this order.");

            // ── Open a single transaction: Payment + Order + Cart + Enrollments ──
            await using var tx = await _orderRepository.BeginTransactionAsync();
            try
            {
                // Update Payment
                payment.Status = PaymentStatus.Success;
                payment.TransactionRef = transactionRef;
                payment.GatewayResponse = gatewayResponse;
                payment.PaymentDate = DateTime.UtcNow;
                payment.Method = PaymentMethod.Visa;
                _paymentRepository.Update(payment);

                // Update Order
                order.Status = OrderStatus.Paid;
                _orderRepository.Update(order);

                // Mark Cart as checked-out
                var cartSpec = new BaseSpecification<Cart>(
                    c => c.UserId == order.UserId && c.Items.Any());
                var carts = await _cartRepository.GetAllWithSpecAsync(cartSpec);
                var cart = carts.OrderByDescending(c => c.Id).FirstOrDefault();
                if (cart != null)
                {
                    cart.IsCheckedOut = true;
                    _cartRepository.Update(cart);
                }

                // Add Enrollments (idempotent — skip if already exists)
                foreach (var item in order.Items)
                {
                    var exists = await _enrollmentRepository.AnyAsync(
                        e => e.UserId == order.UserId && e.PlanworkId == item.PlanworkId);

                    if (!exists)
                    {
                        await _enrollmentRepository.AddAsync(new Enrollment
                        {
                            UserId = order.UserId,
                            PlanworkId = item.PlanworkId,
                            OrderId = order.Id,
                            EnrolledAt = DateTime.UtcNow,
                            IsOnline = item.IsOnline
                        });
                    }
                }

                await _orderRepository.SaveChangesAsync();
                await tx.CommitAsync();

                return payment;
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }
    }
}