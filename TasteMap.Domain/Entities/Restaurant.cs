namespace TasteMap.Domain.Entities;

public class Restaurant
{
    public int Id { get; set; }

    // Базовая информация
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;

    // Тип заведения (адаптация 1-го скрина Booking)
    public string RestaurantType { get; set; } = string.Empty; // Например: "Ресторан", "Кафе", "Бар"

    // Вместимость (адаптация 3-го скрина Booking)
    public int TotalTables { get; set; }
    public int MaxGuestsCapacity { get; set; }

    // Удобства и фильтры (адаптация 4-го скрина Booking)
    public bool HasKidsZone { get; set; }
    public bool IsPetFriendly { get; set; }
    public bool HasWifi { get; set; }
    public bool HasParking { get; set; }
    public bool HasSummerTerrace { get; set; }

    // Связь с владельцем (Owner)
    public int OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    // Связь с бронированиями и отзывами
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}