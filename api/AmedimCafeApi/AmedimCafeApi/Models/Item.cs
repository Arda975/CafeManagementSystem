namespace AmedimCafeApi.Models
{
    public class Item
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public string[] Description{ get; set; }
        public decimal Price { get; set; }
        public int CategoryID { get; set; }
        public byte[] Image { get; set; }
    }
}
