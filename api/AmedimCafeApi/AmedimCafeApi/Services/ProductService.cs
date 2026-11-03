using AmedimCafeApi.Common;
using AmedimCafeApi.Data;
using AmedimCafeApi.Dtos;
using AmedimCafeApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace AmedimCafeApi.Services;

public interface IProductService
{
    Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(CancellationToken ct);
    Task<IReadOnlyList<ProductDto>> GetProductsAsync(int? categoryId, CancellationToken ct);
    Task<ProductDto> GetByIdAsync(int id, CancellationToken ct);
    Task<ProductDto> CreateAsync(CreateProductRequest request, CancellationToken ct);
    Task<ProductDto> UpdateAsync(int id, UpdateProductRequest request, CancellationToken ct);
    Task DeleteAsync(int id, CancellationToken ct);
}

public class ProductService(CafeDbContext db, IImageStorage imageStorage) : IProductService
{
    public async Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(CancellationToken ct) =>
        await db.Categories
            .AsNoTracking()
            .OrderBy(c => c.Id)
            .Select(c => new CategoryDto(c.Id, c.Name))
            .ToListAsync(ct);

    public async Task<IReadOnlyList<ProductDto>> GetProductsAsync(int? categoryId, CancellationToken ct)
    {
        var query = db.Products.AsNoTracking().Where(p => p.IsActive);
        if (categoryId is not null)
            query = query.Where(p => p.CategoryId == categoryId);

        return await query
            .OrderBy(p => p.CategoryId).ThenBy(p => p.Name)
            .Select(ToDto)
            .ToListAsync(ct);
    }

    public async Task<ProductDto> GetByIdAsync(int id, CancellationToken ct) =>
        await db.Products.AsNoTracking()
            .Where(p => p.Id == id && p.IsActive)
            .Select(ToDto)
            .FirstOrDefaultAsync(ct)
        ?? throw new NotFoundException($"Ürün bulunamadı (id: {id}).");

    public async Task<ProductDto> CreateAsync(CreateProductRequest request, CancellationToken ct)
    {
        await EnsureCategoryExistsAsync(request.CategoryId, ct);

        var product = new Product
        {
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            CategoryId = request.CategoryId,
        };

        if (request.Image is { Length: > 0 })
            product.ImagePath = await imageStorage.SaveAsync(request.Image, ct);

        db.Products.Add(product);
        await db.SaveChangesAsync(ct);

        return await GetByIdAsync(product.Id, ct);
    }

    public async Task<ProductDto> UpdateAsync(int id, UpdateProductRequest request, CancellationToken ct)
    {
        var product = await db.Products.FirstOrDefaultAsync(p => p.Id == id && p.IsActive, ct)
            ?? throw new NotFoundException($"Ürün bulunamadı (id: {id}).");

        if (product.CategoryId != request.CategoryId)
            await EnsureCategoryExistsAsync(request.CategoryId, ct);

        product.Name = request.Name.Trim();
        product.Description = request.Description?.Trim();
        product.Price = request.Price;
        product.StockQuantity = request.StockQuantity;
        product.CategoryId = request.CategoryId;

        await db.SaveChangesAsync(ct);
        return await GetByIdAsync(id, ct);
    }

    /// <summary>
    /// Soft delete: the product disappears from the menu, but old orders that reference
    /// it stay intact (OrderItems has a restricting foreign key to Products).
    /// </summary>
    public async Task DeleteAsync(int id, CancellationToken ct)
    {
        var product = await db.Products.FirstOrDefaultAsync(p => p.Id == id && p.IsActive, ct)
            ?? throw new NotFoundException($"Ürün bulunamadı (id: {id}).");

        product.IsActive = false;
        await db.SaveChangesAsync(ct);
    }

    private async Task EnsureCategoryExistsAsync(int categoryId, CancellationToken ct)
    {
        if (!await db.Categories.AnyAsync(c => c.Id == categoryId, ct))
            throw new BusinessRuleException($"Kategori bulunamadı (id: {categoryId}).");
    }

    private static readonly System.Linq.Expressions.Expression<Func<Product, ProductDto>> ToDto = p =>
        new ProductDto(p.Id, p.Name, p.Description, p.Price, p.StockQuantity, p.CategoryId, p.Category.Name, p.ImagePath);
}
