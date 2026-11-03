namespace AmedimCafeApi.Dtos;

public record TableSummaryDto(int Id, string Name, bool IsOccupied, decimal OpenBill);

public record TableDetailDto(int Id, string Name, bool IsOccupied, decimal OpenBill, IReadOnlyList<OrderDto> OpenOrders);

public record PaymentResultDto(int TableId, int PaidOrderCount, decimal PaidAmount, DateTime PaidAt);
