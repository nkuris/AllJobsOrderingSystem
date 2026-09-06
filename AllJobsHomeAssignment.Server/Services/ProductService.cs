using AllJobsHomeAssignment.Server.Data;
using AllJobsHomeAssignment.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AllJobsHomeAssignment.Server.Services;

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _db;
    private readonly ILogger<ProductService> _logger;

    public ProductService(ApplicationDbContext db, ILogger<ProductService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<List<Product>> GetAllAsync(string? search, ProductStatus? status)
    {
        var q = _db.Products.AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(p => p.Name.Contains(search) || p.SKU.Contains(search));
        if (status != null) q = q.Where(p => p.Status == status);
        return await q.OrderBy(p => p.Id).ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _db.Products.FindAsync(id);
    }

    public async Task<Product> CreateAsync(Product product)
    {
        if (product.Price < 0 || product.StockQuantity < 0)
        {
            _logger.LogWarning("Attempt to create product with invalid price/stock: {Price}, {Stock}", product.Price, product.StockQuantity);
            throw new ArgumentException("Price and StockQuantity must be non-negative.");
        }

        product.CreatedAt = DateTime.UtcNow;
        product.UpdatedAt = product.CreatedAt;
        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        _logger.LogInformation("Product created: {Id}", product.Id);
        return product;
    }

    public async Task UpdateAsync(int id, Product updated)
    {
        var p = await _db.Products.FindAsync(id);
        if (p == null) throw new KeyNotFoundException("Product not found");
        if (updated.Price < 0 || updated.StockQuantity < 0)
            throw new ArgumentException("Price and StockQuantity must be non-negative.");

        p.Name = updated.Name;
        p.SKU = updated.SKU;
        p.Description = updated.Description;
        p.Price = updated.Price;
        p.StockQuantity = updated.StockQuantity;
        p.Status = updated.Status;
        p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        _logger.LogInformation("Product updated: {Id}", id);
    }

    public async Task<Product?> ToggleStatusAsync(int id)
    {
        var p = await _db.Products.FindAsync(id);
        if (p == null) return null;
        p.Status = p.Status == ProductStatus.ACTIVE ? ProductStatus.INACTIVE : ProductStatus.ACTIVE;
        p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return p;
    }
}
