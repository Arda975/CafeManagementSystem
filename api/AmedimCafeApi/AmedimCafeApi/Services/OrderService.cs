using AmedimCafeApi.Common;
using AmedimCafeApi.Data;
using AmedimCafeApi.Dtos;
using AmedimCafeApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace AmedimCafeApi.Services;

public interface IOrderService
{
    Task<OrderDto> CreateAsync(CreateOrderRequest request, CancellationToken ct);
}

public class OrderService(CafeDbContext db, ILogger<OrderService> logger) : IOrderService
{
    public async Task<OrderDto> CreateAsync(CreateOrderRequest request, CancellationToken ct)
    {
        if (!await db.Tables.AnyAsync(t => t.Id == request.TableId, ct))
            throw new NotFoundException($"Masa bulunamadı (no: {request.TableId}).");

        // The same product may come in several lines; merge them. Sorting by id makes every
        // request lock product rows in the same order, which avoids deadlocks between
        // concurrent orders.
        var lines = request.Items
            .GroupBy(i => i.ProductId)
            .Select(g => (ProductId: g.Key, Quantity: g.Sum(i => i.Quantity)))
            .OrderBy(l => l.ProductId)
            .ToList();

        var productIds = lines.Select(l => l.ProductId).ToList();
        var products = await db.Products
            .AsNoTracking()
            .Where(p => productIds.Contains(p.Id) && p.IsActive)
            .ToDictionaryAsync(p => p.Id, ct);

        var missing = productIds.Where(id => !products.ContainsKey(id)).ToList();
        if (missing.Count > 0)
            throw new BusinessRuleException($"Menüde bulunmayan ürün: {string.Join(", ", missing)}.");

        // Stock decrease and order insert succeed or fail together.
        await using var transaction = await db.Database.BeginTransactionAsync(ct);

        foreach (var line in lines)
        {
            // Atomic conditional update: "decrease stock only if enough is left".
            // Two simultaneous orders for the last item cannot both succeed, because the
            // second UPDATE waits for the first one's row lock and then sees the new stock.
            var updatedRows = await db.Products
                .Where(p => p.Id == line.ProductId && p.IsActive && p.StockQuantity >= line.Quantity)
                .ExecuteUpdateAsync(s => s.SetProperty(p => p.StockQuantity, p => p.StockQuantity - line.Quantity), ct);

            if (updatedRows == 0)
                throw new ConflictException($"'{products[line.ProductId].Name}' için yeterli stok yok.");
            // Leaving without CommitAsync rolls the transaction back when it is disposed.
        }

        var order = new Order
        {
            TableId = request.TableId,
            Status = OrderStatus.Open,
            CreatedAt = DateTime.UtcNow,
            Items = lines.Select(l => new OrderItem
            {
                ProductId = l.ProductId,
                Quantity = l.Quantity,
                UnitPrice = products[l.ProductId].Price,
            }).ToList(),
        };
        order.TotalAmount = order.Items.Sum(i => i.UnitPrice * i.Quantity);

        db.Orders.Add(order);
        await db.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);

        logger.LogInformation("Order {OrderId} created for table {TableId}, total {Total}", order.Id, order.TableId, order.TotalAmount);

        return OrderMapping.ToDto(order, productId => products[productId].Name);
    }
}

internal static class OrderMapping
{
    public static OrderDto ToDto(Order order, Func<int, string> productName) => new(
        order.Id,
        order.TableId,
        order.Status.ToString(),
        order.TotalAmount,
        order.CreatedAt,
        order.Items
            .Select(i => new OrderItemDto(i.ProductId, productName(i.ProductId), i.Quantity, i.UnitPrice, i.UnitPrice * i.Quantity))
            .ToList());
}
