using System.Collections.Generic;

namespace AllJobsHomeAssignment.Server.DTOs;

public record OrderItemRequest(int ProductId, int Quantity);

public record CreateOrderRequest(string CustomerName, string CustomerEmail, List<OrderItemRequest> Items);
