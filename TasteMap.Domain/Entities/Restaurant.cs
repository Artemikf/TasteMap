using System;
using System.Collections.Generic;

namespace TasteMap.Domain.Entities;

public class Restaurant
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Внешний ключ на владельца (пользователя с ролью RestaurantOwner)
    public int OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    // Навигационные свойства (связи с другими таблицами)
    public ICollection<Event> Events { get; set; } = new List<Event>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}