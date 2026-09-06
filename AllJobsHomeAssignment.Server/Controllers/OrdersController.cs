using AllJobsHomeAssignment.Server.Data;
using AllJobsHomeAssignment.Server.Models;
using AllJobsHomeAssignment.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AllJobsHomeAssignment.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _svc;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(IOrderService svc, ILogger<OrdersController> logger)
    {
        _svc = svc;
        _logger = logger;
    }

    // GET: api/orders?status=
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] OrderStatus? status)
    {
        _logger.LogInformation("Getting orders with status: {Status}", status);
        try
        {
            var list = await _svc.GetAllAsync(status);
            return Ok(list);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders with status: {Status}", status);
            // In development return error details to help debugging client-side failures
            return StatusCode(500, new { message = ex.Message, detail = ex.ToString() });
        }
    }

    // GET: api/orders/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOne(int id)
    {
        _logger.LogInformation("Getting order with ID: {Id}", id);
        try
        {
            var o = await _svc.GetByIdAsync(id);
            if (o == null)
            {
                _logger.LogInformation("Order with ID: {Id} not found", id);
                return NotFound();
            }
            return Ok(o);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting order with ID: {Id}", id);
            return StatusCode(500, new { message = ex.Message, detail = ex.ToString() });
        }
    }

    // Use DTOs from OrderDtos for requests
    // POST: api/orders
    // ADMIN only: create an order (transactional, deduct stock atomically)
    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Create([FromBody] DTOs.CreateOrderRequest req)
    {
        _logger.LogInformation("Creating order for customer: {CustomerName}, email: {CustomerEmail}", req.CustomerName, req.CustomerEmail);
        try
        {
            var order = await _svc.CreateOrderAsync(req);
            return CreatedAtAction(nameof(GetOne), new { id = order.Id }, order);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid order creation request for customer: {CustomerName}, email: {CustomerEmail}", req.CustomerName, req.CustomerEmail);
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Error creating order for customer: {CustomerName}, email: {CustomerEmail}", req.CustomerName, req.CustomerEmail);
            return BadRequest(new { message = ex.Message });
        }
    }

    // PATCH: api/orders/5/status
    // ADMIN only: change order status. Cannot cancel after PAID.
    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> ChangeStatus(int id, [FromQuery] OrderStatus status)
    {
        _logger.LogInformation("Changing status of order ID: {Id} to {Status}", id, status);
        try
        {

            var order = await _svc.ChangeStatusAsync(id, status);
            if (order == null) { _logger.LogInformation("Order with ID: {Id} not found", id); return NotFound(); }
            return Ok(order);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Error changing status of order ID: {Id}", id);
            return BadRequest(new { message = ex.Message });
        }
    }
}
