using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AllJobsHomeAssignment.Server.DTOs;

public record OrderItemRequest(
    int ProductId,
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be a positive integer.")]
    int Quantity
);

public record CreateOrderRequest(
    string CustomerName,
    string CustomerEmail,
    List<OrderItemRequest> Items
);
