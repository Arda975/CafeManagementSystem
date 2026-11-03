using AmedimCafeApi.Common;
using AmedimCafeApi.Data;
using AmedimCafeApi.Dtos;
using AmedimCafeApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace AmedimCafeApi.Services;

public interface ITableService
{
    Task<IReadOnlyList<TableSummaryDto>> GetAllAsync(CancellationToken ct);
    Task<TableDetailDto> GetDetailAsync(int tableId, CancellationToken ct);
    Task<PaymentResultDto> PayAsync(int tableId, CancellationToken ct);
}

/// <summary>
/// A table is "occupied" while it has open (unpaid) orders, and its bill is the sum of
/// those orders. Both are derived from the Orders table instead of being stored, so they
/// can never get out of sync.
/// </summary>
public class TableService(CafeDbContext db, ILogger<TableService> logger) : ITableService
{
    public async Task<IReadOnlyList<TableSummaryDto>> GetAllAsync(CancellationToken ct) =>
        await db.Tables
            .AsNoTracking()
            .OrderBy(t => t.Id)
            .Select(t => new TableSummaryDto(
                t.Id,
                t.Name,
                t.Orders.Any(o => o.Status == OrderStatus.Open),
                t.Orders.Where(o => o.Status == OrderStatus.Open).Sum(o => o.TotalAmount)))
            .ToListAsync(ct);

    public async Task<TableDetailDto> GetDetailAsync(int tableId, CancellationToken ct)
    {
        var table = await db.Tables.AsNoTracking().FirstOrDefaultAsync(t => t.Id == tableId, ct)
            ?? throw new NotFoundException($"Masa bulunamadı (no: {tableId}).");

        var openOrders = await db.Orders
            .AsNoTracking()
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Where(o => o.TableId == tableId && o.Status == OrderStatus.Open)
            .OrderBy(o => o.CreatedAt)
            .ToListAsync(ct);

        var orderDtos = openOrders
            .Select(o => OrderMapping.ToDto(o, productId => o.Items.First(i => i.ProductId == productId).Product.Name))
            .ToList();

        return new TableDetailDto(
            table.Id,
            table.Name,
            orderDtos.Count > 0,
            orderDtos.Sum(o => o.TotalAmount),
            orderDtos);
    }

    public async Task<PaymentResultDto> PayAsync(int tableId, CancellationToken ct)
    {
        if (!await db.Tables.AnyAsync(t => t.Id == tableId, ct))
            throw new NotFoundException($"Masa bulunamadı (no: {tableId}).");

        // Only the orders loaded here are closed. An order placed at the same moment stays
        // open and shows up on the table's next bill instead of being silently marked paid.
        var openOrders = await db.Orders
            .Where(o => o.TableId == tableId && o.Status == OrderStatus.Open)
            .ToListAsync(ct);

        if (openOrders.Count == 0)
            throw new BusinessRuleException("Bu masada ödenmemiş sipariş yok.");

        var paidAt = DateTime.UtcNow;
        foreach (var order in openOrders)
        {
            order.Status = OrderStatus.Paid;
            order.PaidAt = paidAt;
        }

        await db.SaveChangesAsync(ct);

        var paidAmount = openOrders.Sum(o => o.TotalAmount);
        logger.LogInformation("Table {TableId} paid: {Count} orders, {Amount}", tableId, openOrders.Count, paidAmount);

        return new PaymentResultDto(tableId, openOrders.Count, paidAmount, paidAt);
    }
}
