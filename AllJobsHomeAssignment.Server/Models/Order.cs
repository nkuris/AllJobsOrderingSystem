using System.ComponentModel.DataAnnotations;

namespace AllJobsHomeAssignment.Server.Models;

public class Order
{
    public int Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string CustomerName { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    public string CustomerEmail { get; set; } = null!;

    public OrderStatus Status { get; set; } = OrderStatus.NEW;

    [Required]
    public decimal TotalAmount { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
