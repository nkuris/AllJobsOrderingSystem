using AllJobsHomeAssignment.Server.DTOs;
using AllJobsHomeAssignment.Server.Models;

namespace AllJobsHomeAssignment.Server.Services;

public interface IOrderService
{
    Task<List<Order>> GetAllAsync(OrderStatus? status);
    Task<Order?> GetByIdAsync(int id);
    Task<Order> CreateOrderAsync(CreateOrderRequest req);
    Task<Order?> ChangeStatusAsync(int id, OrderStatus status);
}
