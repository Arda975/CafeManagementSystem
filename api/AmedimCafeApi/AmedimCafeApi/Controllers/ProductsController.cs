using AmedimCafeApi.Auth;
using AmedimCafeApi.Dtos;
using AmedimCafeApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AmedimCafeApi.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController(IProductService productService) : ControllerBase
{
    /// <summary>Public menu. Optionally filtered by category.</summary>
    [HttpGet]
    [AllowAnonymous]
    public Task<IReadOnlyList<ProductDto>> GetAll([FromQuery] int? categoryId, CancellationToken ct) =>
        productService.GetProductsAsync(categoryId, ct);

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public Task<ProductDto> GetById(int id, CancellationToken ct) => productService.GetByIdAsync(id, ct);

    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    [Consumes("multipart/form-data")]
    [ProducesResponseType<ProductDto>(StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromForm] CreateProductRequest request, CancellationToken ct)
    {
        var product = await productService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    public Task<ProductDto> Update(int id, UpdateProductRequest request, CancellationToken ct) =>
        productService.UpdateAsync(id, request, ct);

    [HttpDelete("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await productService.DeleteAsync(id, ct);
        return NoContent();
    }
}
