namespace AmedimCafeApi.Models
{
    public class OrderRequest
    {
        public int TableId { get; set; }  // Masa ID'si
        public string OrderContent { get; set; }  // Sipariş içeriği
        public int TotalAmount { get; set; }  // Toplam tutar
    }
}
