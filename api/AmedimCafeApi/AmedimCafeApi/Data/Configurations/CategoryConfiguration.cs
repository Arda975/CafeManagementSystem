using AmedimCafeApi.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AmedimCafeApi.Data.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        // Seeded rows use fixed ids, so generated ids start after them.
        builder.Property(c => c.Id).HasIdentityOptions(startValue: 100);

        builder.Property(c => c.Name).IsRequired().HasMaxLength(50);
        builder.HasIndex(c => c.Name).IsUnique();

        builder.HasData(SeedData.Categories);
    }
}
