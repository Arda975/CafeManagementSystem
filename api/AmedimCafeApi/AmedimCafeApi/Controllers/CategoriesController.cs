using AmedimCafeApi.Dtos;
using AmedimCafeApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AmedimCafeApi.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController(IProductService productService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public Task<IReadOnlyList<CategoryDto>> GetAll(CancellationToken ct) => productService.GetCategoriesAsync(ct);
}
