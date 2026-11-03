using AmedimCafeApi.Entities;

namespace AmedimCafeApi.Data;

/// <summary>
/// Reference data that every installation needs. It is written into the initial
/// migration with HasData, so `dotnet ef database update` creates a usable menu.
/// Values must stay static (no DateTime.Now etc.), otherwise EF sees a model change
/// on every build.
/// </summary>
public static class SeedData
{
    public static readonly Category[] Categories =
    [
        new() { Id = 1, Name = "Tatlılar" },
        new() { Id = 2, Name = "Ana Yemekler" },
        new() { Id = 3, Name = "Atıştırmalıklar" },
        new() { Id = 4, Name = "İçecekler" },
    ];

    public static readonly CafeTable[] Tables = Enumerable.Range(1, 10)
        .Select(i => new CafeTable { Id = i, Name = $"Masa {i}" })
        .ToArray();

    private const int InitialStock = 100;

    public static readonly Product[] Products =
    [
        P(1, "Pizza", "Mantar, Nane, Kaşar Peynir, Biber, Domates", 50m, 2, "assets/pizza.jpg"),
        P(2, "Hamburger", "100 gr Köfte, Soğan, Çedar, Domates, Marul, Jambon", 45m, 2, "assets/hamburger.jpg"),
        P(3, "Kremalı Mantarlı Tavuklu Makarna", "Mantar, Makarna, Krema, 100 gr Tavuk", 80m, 2, "assets/kremamakarna.jpg"),
        P(4, "Sucuklu Tost", "Sucuk, Trabzon Ekmeği", 30m, 3, "assets/sucuklutost.jpg"),
        P(5, "Patates Kızartması", "Kıtır kıtır patates", 15m, 3, "assets/patateskızartması.jpg"),
        P(6, "Kola", "Soğuk Kola", 110m, 4, "assets/buzlukola.jpg"),
        P(7, "Soğuk Su", "Su", 5m, 4, "assets/buzlusu.jpg"),
        P(8, "Filtre Kahve", "Kahve", 20m, 4, "assets/filtrekahve.jpg"),
        P(9, "Mangolu Frappe", "Mango, Kahve", 30m, 4, "assets/mangofrappe.jpg"),
        P(10, "Ice Çikolatalı Latte", "Laktozsuz Süt, Kahve, Buz", 30m, 4, "assets/icechocolatelatte.jpg"),
        P(11, "Amed Special", "Çikolata, Kadayıf, Antep Fıstığı Ezmesi", 50m, 1, "assets/amedspecial.jpg"),
        P(12, "Cheesecake", "Kremalı cheesecake", 25m, 1, "assets/cheesecake.jpg"),
    ];

    private static Product P(int id, string name, string description, decimal price, int categoryId, string image) => new()
    {
        Id = id,
        Name = name,
        Description = description,
        Price = price,
        CategoryId = categoryId,
        ImagePath = image,
        StockQuantity = InitialStock,
        IsActive = true,
    };
}
