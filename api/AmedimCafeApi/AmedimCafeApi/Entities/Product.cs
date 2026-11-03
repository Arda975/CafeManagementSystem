namespace AmedimCafeApi.Entities;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }

    /// <summary>
    /// Relative path of the product image, e.g. "assets/pizza.jpg" (served by the frontend)
    /// or "uploads/{guid}.jpg" (uploaded through the API).
    /// </summary>
    public string? ImagePath { get; set; }

    /// <summary>
    /// Products are soft-deleted so that past orders keep pointing at a valid product.
    /// </summary>
    public bool IsActive { get; set; } = true;

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}
