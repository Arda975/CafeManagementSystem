using System.ComponentModel.DataAnnotations;

namespace AmedimCafeApi.Dtos;

/// <summary>
/// The client only says WHAT it wants. Prices and the total are calculated on the
/// server from the database, so a manipulated request cannot change the bill.
/// </summary>
public class CreateOrderRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "Geçerli bir masa seçilmelidir.")]
    public int TableId { get; set; }

    [Required, MinLength(1, ErrorMessage = "Sipariş en az bir ürün içermelidir."), MaxLength(50)]
    public List<CreateOrderItemRequest> Items { get; set; } = [];
}

public class CreateOrderItemRequest
{
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Range(1, 50, ErrorMessage = "Adet 1 ile 50 arasında olmalıdır.")]
    public int Quantity { get; set; }
}

public record OrderItemDto(int ProductId, string ProductName, int Quantity, decimal UnitPrice, decimal LineTotal);

public record OrderDto(int Id, int TableId, string Status, decimal TotalAmount, DateTime CreatedAt, IReadOnlyList<OrderItemDto> Items);
