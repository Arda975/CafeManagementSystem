using AmedimCafeApi.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AmedimCafeApi.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.Property(o => o.TotalAmount).HasPrecision(10, 2);

        // Stored as text ("Open"/"Paid") so the data stays readable in the database.
        builder.Property(o => o.Status).HasConversion<string>().HasMaxLength(20);

        builder.HasOne(o => o.Table)
            .WithMany(t => t.Orders)
            .HasForeignKey(o => o.TableId)
            .OnDelete(DeleteBehavior.Restrict);

        // "Open orders of table X" is the most frequent query.
        builder.HasIndex(o => new { o.TableId, o.Status });
    }
}

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.ToTable(t => t.HasCheckConstraint("CK_OrderItems_Quantity_Positive", "\"Quantity\" > 0"));

        builder.Property(i => i.UnitPrice).HasPrecision(10, 2);

        builder.HasOne(i => i.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(i => i.Product)
            .WithMany()
            .HasForeignKey(i => i.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
