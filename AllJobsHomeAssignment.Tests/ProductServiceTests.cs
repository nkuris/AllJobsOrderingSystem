using AllJobsHomeAssignment.Server.Data;
using AllJobsHomeAssignment.Server.Models;
using AllJobsHomeAssignment.Server.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace AllJobsHomeAssignment.Tests;

public class ProductServiceTests
{
    private ApplicationDbContext CreateContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task CreateAsync_InvalidPrice_ThrowsArgumentException()
    {
        using var ctx = CreateContext("test_invalid_price");
        var svc = new ProductService(ctx, NullLogger<ProductService>.Instance);
        var p = new Product { Name = "X", SKU = "X1", Price = -1m, StockQuantity = 10, Status = ProductStatus.ACTIVE };

        await Assert.ThrowsAsync<ArgumentException>(() => svc.CreateAsync(p));
    }

    [Fact]
    public async Task CreateAsync_ValidProduct_CreatesProduct()
    {
        using var ctx = CreateContext("test_create_product");
        var svc = new ProductService(ctx, NullLogger<ProductService>.Instance);
        var p = new Product { Name = "Widget", SKU = "W1", Price = 9.99m, StockQuantity = 5, Status = ProductStatus.ACTIVE };

        var created = await svc.CreateAsync(p);

        Assert.True(created.Id > 0);
        var fromDb = await ctx.Products.FindAsync(created.Id);
        Assert.NotNull(fromDb);
        Assert.Equal("Widget", fromDb!.Name);
    }
}
