using System.ComponentModel.DataAnnotations;

namespace AllJobsHomeAssignment.Server.Models;

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }
    [System.Text.Json.Serialization.JsonIgnore]
    public Order? Order { get; set; }

    public int ProductId { get; set; }
    public Product? Product { get; set; }

    [Required]
    public int Quantity { get; set; }

    [Required]
    public decimal UnitPrice { get; set; }

    [Required]
    public decimal LineTotal { get; set; }
}
