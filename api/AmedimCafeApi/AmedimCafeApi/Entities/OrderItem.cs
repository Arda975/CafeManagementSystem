namespace AmedimCafeApi.Entities;

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int Quantity { get; set; }

    /// <summary>
    /// Price at the moment the order was placed. Later price changes must not
    /// change the bill of an order that already exists.
    /// </summary>
    public decimal UnitPrice { get; set; }
}
