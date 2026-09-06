using System.ComponentModel.DataAnnotations;

namespace AllJobsHomeAssignment.Server.Models;

public class Product
{
    public int Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = null!;

    [Required]
    [MaxLength(100)]
    public string SKU { get; set; } = null!;

    public string? Description { get; set; }

    [Required]
    public decimal Price { get; set; }

    [Required]
    public int StockQuantity { get; set; }

    public ProductStatus Status { get; set; } = ProductStatus.ACTIVE;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
