using AllJobsHomeAssignment.Server.Models;

namespace AllJobsHomeAssignment.Server.Services;

public interface IProductService
{
    Task<List<Product>> GetAllAsync(string? search, ProductStatus? status);
    Task<Product?> GetByIdAsync(int id);
    Task<Product> CreateAsync(Product product);
    Task UpdateAsync(int id, Product updated);
    Task<Product?> ToggleStatusAsync(int id);
}
