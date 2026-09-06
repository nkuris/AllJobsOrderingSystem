using AllJobsHomeAssignment.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace AllJobsHomeAssignment.Server.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<OrderItem> OrderItems { get; set; } = null!;
    public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(eb =>
        {
            eb.HasIndex(u => u.Email).IsUnique();
            eb.Property(u => u.Role).HasConversion<string>();
        });

        modelBuilder.Entity<Product>(eb =>
        {
            eb.HasIndex(p => p.SKU).IsUnique();
            eb.Property(p => p.Status).HasConversion<string>();
            eb.Property(p => p.Price).HasPrecision(18, 2);
        });

        modelBuilder.Entity<Order>(eb =>
        {
            eb.Property(o => o.Status).HasConversion<string>();
            eb.Property(o => o.TotalAmount).HasPrecision(18, 2);
        });

        modelBuilder.Entity<OrderItem>(eb =>
        {
            eb.Property(oi => oi.UnitPrice).HasPrecision(18, 2);
            eb.Property(oi => oi.LineTotal).HasPrecision(18, 2);
            eb.HasOne(oi => oi.Order).WithMany(o => o.Items).HasForeignKey(oi => oi.OrderId).OnDelete(DeleteBehavior.Cascade);
            eb.HasOne(oi => oi.Product).WithMany().HasForeignKey(oi => oi.ProductId);
        });
    }
}
