using AllJobsHomeAssignment.Server.Data;
using AllJobsHomeAssignment.Server.DTOs;
using AllJobsHomeAssignment.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AllJobsHomeAssignment.Server.Services;

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _db;
    private readonly ILogger<OrderService> _logger;

    /// <summary>
    /// Constructs the OrderService with the specified database context and logger.
    /// </summary>
    /// <param name="db"></param>
    /// <param name="logger"></param>
    public OrderService(ApplicationDbContext db, ILogger<OrderService> logger)
    {
        _db = db;
        _logger = logger;
    }

    /// <summary>
    /// Gets all orders rfom status
    /// </summary>
    /// <param name="status"></param>
    /// <returns></returns>
    public async Task<List<Order>> GetAllAsync(OrderStatus? status)
    {
        _logger.LogInformation("Getting all orders with status: {Status}", status);
        var q = _db.Orders.Include(o => o.Items).AsQueryable();
        if (status != null) q = q.Where(o => o.Status == status);
        return await q.OrderByDescending(o => o.CreatedAt).ToListAsync();
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        _logger.LogInformation("Fetching order by id: {Id}", id);
        return await _db.Orders.Include(x => x.Items).ThenInclude(i => i.Product).FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Order> CreateOrderAsync(CreateOrderRequest req)
    {
        if (req.Items == null || !req.Items.Any())
        {
            _logger.LogWarning("Attempted to create order with no items");
            throw new ArgumentException("At least one item required");
        }

        // Use the execution strategy to handle retries with transactions
        var strategy = _db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            // Start a transaction to ensure atomicity of the order creation process
            using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                // Aggregate quantities per product to minimize DB updates and handle duplicates
                var grouped = req.Items
                    .GroupBy(i => i.ProductId)
                    .Select(g => new { ProductId = g.Key, Quantity = g.Sum(x => x.Quantity) })
                    .ToList();

                // Validate quantities and fetch involved products
                var productIds = grouped.Select(g => g.ProductId).ToList();
                var products = await _db.Products.Where(p => productIds.Contains(p.Id)).ToListAsync();
                var prodById = products.ToDictionary(p => p.Id);

                // Ensure all products exist
                foreach (var grp in grouped)
                {
                    if (!prodById.ContainsKey(grp.ProductId))
                    {
                        _logger.LogError("Product not found while creating order: {ProductId}", grp.ProductId);
                        throw new KeyNotFoundException($"Product {grp.ProductId} not found");
                    }
                    if (grp.Quantity <= 0)
                    {
                        _logger.LogWarning("Invalid quantity for product {ProductId}: {Quantity}", grp.ProductId, grp.Quantity);
                        throw new ArgumentException($"Invalid quantity for product {grp.ProductId}.");
                    }
                }

                // Attempt to decrement stock for each product atomically using aggregated quantities
                foreach (var grp in grouped)
                {
                    var affected = await _db.Database.ExecuteSqlInterpolatedAsync($"UPDATE Products SET StockQuantity = StockQuantity - {grp.Quantity} WHERE Id = {grp.ProductId} AND StockQuantity >= {grp.Quantity}");
                    if (affected == 0)
                    {
                        _logger.LogWarning("Insufficient stock for product {ProductId}", grp.ProductId);
                        throw new InvalidOperationException($"Insufficient stock for product {grp.ProductId}.");
                    }
                }

                var now = DateTime.UtcNow;
                // Create the order record
                var order = new Order
                {
                    CustomerName = req.CustomerName,
                    CustomerEmail = req.CustomerEmail,
                    Status = OrderStatus.NEW,
                    CreatedAt = now,
                    UpdatedAt = now
                };

                // Build order items and compute total using fetched product prices
                decimal total = 0m;
                foreach (var item in req.Items)
                {
                    var prod = prodById[item.ProductId];
                    var unit = prod.Price;
                    var line = unit * item.Quantity;
                    var oi = new OrderItem
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = unit,
                        LineTotal = line
                    };
                    order.Items.Add(oi);
                    total += line;
                }

                order.TotalAmount = total;
                // Add order and items in one SaveChanges to reduce round-trips
                _db.Orders.Add(order);
                await _db.SaveChangesAsync();
                await tx.CommitAsync();
                _logger.LogInformation("Order created: {OrderId}", order.Id);
                return order;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order");
                await tx.RollbackAsync();
                throw;
            }
        });
    }

    public async Task<Order?> ChangeStatusAsync(int id, OrderStatus status)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return null;
        _logger.LogInformation("Changing status for order {OrderId} from {OldStatus} to {NewStatus}", id, order.Status, status);

        if (order.Status == OrderStatus.PAID && status == OrderStatus.CANCELLED)
        {
            _logger.LogWarning("Attempt to cancel already paid order: {OrderId}", id);
            throw new InvalidOperationException("Cannot cancel an order that is already PAID.");
        }

        if (status == OrderStatus.CANCELLED && order.Status != OrderStatus.CANCELLED)
        {
            var items = await _db.OrderItems.Where(i => i.OrderId == order.Id).ToListAsync();
            foreach (var it in items)
            {
                await _db.Database.ExecuteSqlInterpolatedAsync($"UPDATE Products SET StockQuantity = StockQuantity + {it.Quantity} WHERE Id = {it.ProductId}");
            }
        }

        order.Status = status;
        order.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        _logger.LogInformation("Order status changed: {OrderId} -> {Status}", id, status);
        return order;
    }
}
