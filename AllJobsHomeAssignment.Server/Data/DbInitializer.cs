using AllJobsHomeAssignment.Server.Models;
using AllJobsHomeAssignment.Server.Services;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace AllJobsHomeAssignment.Server.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        var context = services.GetRequiredService<ApplicationDbContext>();

        // In containerized development, avoid runtime migration compatibility checks and
        // ensure the database is created to match the current model. This uses EnsureCreated
        // which is acceptable for a development/demo environment.
        await context.Database.EnsureCreatedAsync();

        var now = DateTime.UtcNow;

        // Ensure seeded users exist
        var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "admin@example.com");
        var viewerUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "viewer@example.com");

        if (adminUser == null)
        {
            adminUser = new User
            {
                Email = "admin@example.com",
                PasswordHash = PasswordHasher.Hash("Admin123!"),
                FirstName = "Admin",
                LastName = "User",
                Phone = "0000000000",
                Address = "Admin Address",
                Role = UserRole.ADMIN,
                CreatedAt = now,
                UpdatedAt = now
            };
            context.Users.Add(adminUser);
        }
        else
        {
            // Update password in case it was changed
            adminUser.PasswordHash = PasswordHasher.Hash("Admin123!");
            adminUser.UpdatedAt = now;
            context.Users.Update(adminUser);
        }

        if (viewerUser == null)
        {
            viewerUser = new User
            {
                Email = "viewer@example.com",
                PasswordHash = PasswordHasher.Hash("Viewer123!"),
                FirstName = "Viewer",
                LastName = "User",
                Phone = "0000000000",
                Address = "Viewer Address",
                Role = UserRole.VIEWER,
                CreatedAt = now,
                UpdatedAt = now
            };
            context.Users.Add(viewerUser);
        }
        else
        {
            // Update password in case it was changed
            viewerUser.PasswordHash = PasswordHasher.Hash("Viewer123!");
            viewerUser.UpdatedAt = now;
            context.Users.Update(viewerUser);
        }

        await context.SaveChangesAsync();

        // Ensure products exist
        if (!await context.Products.AnyAsync())
        {
            var products = new List<Product>();
            for (int i = 1; i <= 10; i++)
            {
                // Create a mix of ACTIVE/INACTIVE products. Make every 3rd product INACTIVE so
                // filters can be tested reliably in the UI.
                var status = (i % 3 == 0) ? ProductStatus.INACTIVE : ProductStatus.ACTIVE;
                products.Add(new Product
                {
                    Name = $"Product {i}",
                    SKU = $"SKU-{i:000}",
                    Description = $"Sample product {i}",
                    Price = 10m * i,
                    StockQuantity = 5 + i * 2, // varied stock
                    Status = status,
                    CreatedAt = now,
                    UpdatedAt = now
                });
            }

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
        }

        // Load products from DB for creating order items
        var dbProducts = await context.Products.ToListAsync();

        // Ensure product statuses follow the intended test pattern (every 3rd product INACTIVE)
        var productsChanged = false;
        for (int i = 0; i < dbProducts.Count; i++)
        {
            var p = dbProducts[i];
            var desired = ((i + 1) % 3 == 0) ? ProductStatus.INACTIVE : ProductStatus.ACTIVE;
            if (p.Status != desired)
            {
                p.Status = desired;
                p.UpdatedAt = now;
                context.Products.Update(p);
                productsChanged = true;
            }
        }
        if (productsChanged)
            await context.SaveChangesAsync();

        // Add example orders for admin/viewer if missing
        var adminHasOrders = await context.Orders.AnyAsync(o => o.CustomerEmail == "admin@example.com");
        var viewerHasOrders = await context.Orders.AnyAsync(o => o.CustomerEmail == "viewer@example.com");

        var ordersToAdd = new List<Order>();

        if (!adminHasOrders)
        {
            var adminOrderNew = new Order
            {
                CustomerName = "Admin User",
                CustomerEmail = "admin@example.com",
                Status = OrderStatus.NEW,
                CreatedAt = now,
                UpdatedAt = now
            };
            var adminOi1 = new OrderItem
            {
                ProductId = dbProducts[Math.Min(3, dbProducts.Count - 1)].Id,
                Quantity = 1,
                UnitPrice = dbProducts[Math.Min(3, dbProducts.Count - 1)].Price,
                LineTotal = dbProducts[Math.Min(3, dbProducts.Count - 1)].Price
            };
            adminOrderNew.Items.Add(adminOi1);
            adminOrderNew.TotalAmount = adminOi1.LineTotal;

            var adminOrderPaid = new Order
            {
                CustomerName = "Admin User",
                CustomerEmail = "admin@example.com",
                Status = OrderStatus.PAID,
                CreatedAt = now,
                UpdatedAt = now
            };
            var adminOi2 = new OrderItem
            {
                ProductId = dbProducts[Math.Min(4, dbProducts.Count - 1)].Id,
                Quantity = 2,
                UnitPrice = dbProducts[Math.Min(4, dbProducts.Count - 1)].Price,
                LineTotal = dbProducts[Math.Min(4, dbProducts.Count - 1)].Price * 2
            };
            adminOrderPaid.Items.Add(adminOi2);
            adminOrderPaid.TotalAmount = adminOi2.LineTotal;

            ordersToAdd.Add(adminOrderNew);
            ordersToAdd.Add(adminOrderPaid);
        }

        if (!viewerHasOrders)
        {
            var viewerOrderNew = new Order
            {
                CustomerName = "Viewer User",
                CustomerEmail = "viewer@example.com",
                Status = OrderStatus.NEW,
                CreatedAt = now,
                UpdatedAt = now
            };
            var viewerOi1 = new OrderItem
            {
                ProductId = dbProducts[Math.Min(5, dbProducts.Count - 1)].Id,
                Quantity = 1,
                UnitPrice = dbProducts[Math.Min(5, dbProducts.Count - 1)].Price,
                LineTotal = dbProducts[Math.Min(5, dbProducts.Count - 1)].Price
            };
            viewerOrderNew.Items.Add(viewerOi1);
            viewerOrderNew.TotalAmount = viewerOi1.LineTotal;

            var viewerOrderCancelled = new Order
            {
                CustomerName = "Viewer User",
                CustomerEmail = "viewer@example.com",
                Status = OrderStatus.CANCELLED,
                CreatedAt = now,
                UpdatedAt = now
            };
            var viewerOi2 = new OrderItem
            {
                ProductId = dbProducts[Math.Min(6, dbProducts.Count - 1)].Id,
                Quantity = 3,
                UnitPrice = dbProducts[Math.Min(6, dbProducts.Count - 1)].Price,
                LineTotal = dbProducts[Math.Min(6, dbProducts.Count - 1)].Price * 3
            };
            viewerOrderCancelled.Items.Add(viewerOi2);
            viewerOrderCancelled.TotalAmount = viewerOi2.LineTotal;

            ordersToAdd.Add(viewerOrderNew);
            ordersToAdd.Add(viewerOrderCancelled);
        }

        if (ordersToAdd.Count > 0)
        {
            // attach order items properly (EF will set foreign keys from ProductId)
            await context.Orders.AddRangeAsync(ordersToAdd);
            await context.SaveChangesAsync();
        }
    }
}
