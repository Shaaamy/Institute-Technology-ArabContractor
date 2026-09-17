using Institute.Domain.Entities;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface ICheckoutService
    {
        Task<Order> CreateOrderAsync(int userId);
        Task<AppUser> GetUserByClerkIdAsync(string clerkUserId);
        Task UpdateOrderGatewayDataAsync(Order order);
        Task<Order?> GetOrderByIdAsync(int orderId);
     //   Task<Payment> ProcessPaymentAsync(int orderId, string transactionRef, string gatewayResponse, bool success);
        Task<Payment> MarkOrderAsPaidAsync(Order order, string transactionRef, string gatewayResponse);
        Task UpdateOrderAsync(Order order);
    }
}