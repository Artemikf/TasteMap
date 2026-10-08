using Microsoft.EntityFrameworkCore;
using TasteMap.Domain.Entities;

namespace TasteMap.Application.Interfaces;

public interface IAppDbContext
{
    DbSet<User> Users { get; set; }
    DbSet<Restaurant> Restaurants { get; set; }
    DbSet<Booking> Bookings { get; set; }

    // Метод для сохранения изменений
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}