namespace AmedimCafeApi.Entities;

public class Order
{
    public int Id { get; set; }
    public int TableId { get; set; }
    public CafeTable Table { get; set; } = null!;

    public OrderStatus Status { get; set; } = OrderStatus.Open;
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? PaidAt { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

public enum OrderStatus
{
    Open = 0,
    Paid = 1
}
