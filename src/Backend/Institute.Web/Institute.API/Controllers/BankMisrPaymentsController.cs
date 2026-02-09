using Institute.API.DTOs;
using Institute.Application.Interfaces;
using Institute.Application.Services;
using Institute.Domain.Entities;
using Institute.Domain.Enums;
using Institute.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Institute.API.Controllers
{
    [ApiController]
    [Route("api/payments/bankmisr")]
    public class BankMisrPaymentsController : ControllerBase
    {
        private readonly BankMisrPaymentService _bank;
        private readonly IRepository<Order> _orders;
        private readonly IRepository<OrderItem> _orderItems;
        private readonly IRepository<Payment> _payments;
        private readonly IRepository<CoursePurchase> _purchases;
        private readonly ITransactionLogService _transactionLog;
        private readonly AppDbContext _context;

        public BankMisrPaymentsController(
            BankMisrPaymentService bank,
            IRepository<Order> orders,
            IRepository<OrderItem> orderItems,
            IRepository<Payment> payments,
            IRepository<CoursePurchase> purchases,
            ITransactionLogService transactionLog,
            AppDbContext context)
        {
            _bank = bank;
            _orders = orders;
            _orderItems = orderItems;
            _payments = payments;
            _purchases = purchases;
            _transactionLog = transactionLog;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
        {
            if (dto.PlanworkIds == null || !dto.PlanworkIds.Any())
                return BadRequest("No items selected");

            decimal totalAmount = 0;
            var orderItems = new List<OrderItem>();

            foreach (var planworkId in dto.PlanworkIds)
            {
                totalAmount += 100;

                orderItems.Add(new OrderItem
                {
                    PlanworkId = planworkId,
                    Price = 100 
                });
            }

            var order = new Order
            {
                UserId = dto.UserId,
                TotalAmount = totalAmount,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            await _orders.AddAsync(order);
            await _context.SaveChangesAsync();

            foreach (var item in orderItems)
            {
                item.OrderId = order.Id;
                await _orderItems.AddAsync(item);
            }
            await _context.SaveChangesAsync();

            return Ok(new { orderId = order.Id, totalAmount = order.TotalAmount });
        }

        [HttpPost("start")]
        public async Task<IActionResult> StartPayment(int orderId)
        {
            var order = await _orders.GetByIdAsync(orderId);
            if (order == null) return NotFound("Order not found");

            if (order.Status != OrderStatus.Pending)
                return BadRequest("Order cannot be paid");

            var sessionId = await _bank.CreateCheckoutSessionAsync(order.Id, order.TotalAmount, "EGP");

            return Ok(new { sessionId });
        }

        [HttpGet("verify")]
        public async Task<IActionResult> VerifyPayment(int orderId, string resultIndicator)
        {
            var isSuccess = await _bank.VerifyPaymentAsync(orderId, resultIndicator);

            if (isSuccess)
            {
                await FulfillOrder(orderId);
                return Ok(new { message = "Payment successful and order fulfilled" });
            }

            return BadRequest("Payment verification failed");
        }

        [HttpPost("refund")]
        public async Task<IActionResult> RefundPayment(int orderId, decimal amount, string reason)
        {
            var success = await _bank.RefundAsync(orderId, amount, reason);
            if (success) return Ok("Refund processed successfully");
            return BadRequest("Refund failed");
        }

        private async Task FulfillOrder(int orderId)
        {
            var order = await _orders.GetByIdAsync(orderId);
            if (order == null) return;

            // 1. Update Order Status
            order.Status = OrderStatus.Paid;
            _orders.Update(order);

            // 2. Create Payment Record (Existing table)
            var payment = new Payment
            {
                OrderId = orderId,
                Amount = order.TotalAmount,
                Status = PaymentStatus.Success,
                PaymentDate = DateTime.UtcNow,
                Method = PaymentMethod.Visa, 
                TransactionRef = "BankMisr-" + orderId
            };
            await _payments.AddAsync(payment);

            // 3. Create Course Purchases (Fullfillment)
            var allItems = await _orderItems.GetAllAsync();
            var orderItems = allItems.Where(i => i.OrderId == orderId);

            foreach (var item in orderItems)
            {
                await _purchases.AddAsync(new CoursePurchase
                {
                    UserId = order.UserId,
                    PlanworkId = item.PlanworkId,
                    PurchaseDate = DateTime.UtcNow,
                    Quantity = 1,
                    TotalPrice = item.Price,
                    Status = "Success"
                });
            }

            await _context.SaveChangesAsync();
        }
    }
}
