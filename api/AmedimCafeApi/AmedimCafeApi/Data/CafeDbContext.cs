using AmedimCafeApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace AmedimCafeApi.Data;

public class CafeDbContext(DbContextOptions<CafeDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<CafeTable> Tables => Set<CafeTable>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Picks up every IEntityTypeConfiguration<T> in Data/Configurations.
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CafeDbContext).Assembly);
    }
}
