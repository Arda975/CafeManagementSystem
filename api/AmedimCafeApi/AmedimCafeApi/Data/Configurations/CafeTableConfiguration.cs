using AmedimCafeApi.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AmedimCafeApi.Data.Configurations;

public class CafeTableConfiguration : IEntityTypeConfiguration<CafeTable>
{
    public void Configure(EntityTypeBuilder<CafeTable> builder)
    {
        builder.Property(t => t.Id).HasIdentityOptions(startValue: 100);

        builder.Property(t => t.Name).IsRequired().HasMaxLength(50);
        builder.HasIndex(t => t.Name).IsUnique();

        builder.HasData(SeedData.Tables);
    }
}
