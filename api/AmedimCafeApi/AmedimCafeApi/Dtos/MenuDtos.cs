using System.ComponentModel.DataAnnotations;

namespace AmedimCafeApi.Dtos;

public record CategoryDto(int Id, string Name);

public record ProductDto(
    int Id,
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity,
    int CategoryId,
    string CategoryName,
    string? ImagePath);

/// <summary>Sent as multipart/form-data because it can carry an image file.</summary>
public class CreateProductRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Range(0, 100_000)]
    public decimal Price { get; set; }

    [Range(0, 100_000)]
    public int StockQuantity { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Kategori seçilmelidir.")]
    public int CategoryId { get; set; }

    public IFormFile? Image { get; set; }
}

public class UpdateProductRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Range(0, 100_000)]
    public decimal Price { get; set; }

    [Range(0, 100_000)]
    public int StockQuantity { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Kategori seçilmelidir.")]
    public int CategoryId { get; set; }
}
