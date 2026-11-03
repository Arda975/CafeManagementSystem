using AmedimCafeApi.Common;
using AmedimCafeApi.Dtos;
using AmedimCafeApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AmedimCafeApi.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController(IOrderService orderService) : ControllerBase
{
    /// <summary>
    /// Customers order from the QR menu without an account, so this endpoint is public.
    /// The server validates the table, the products and the stock, and computes the total.
    /// </summary>
    [HttpPost]
    [AllowAnonymous]
    [EnableRateLimiting(RateLimitPolicies.PublicOrders)]
    [ProducesResponseType<OrderDto>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create(CreateOrderRequest request, CancellationToken ct)
    {
        var order = await orderService.CreateAsync(request, ct);
        return StatusCode(StatusCodes.Status201Created, order);
    }
}
