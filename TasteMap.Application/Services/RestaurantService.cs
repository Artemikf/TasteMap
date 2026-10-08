using Microsoft.EntityFrameworkCore;
using TasteMap.Application.DTOs.Restaurants;
using TasteMap.Application.Interfaces;
using TasteMap.Domain.Entities;

namespace TasteMap.Application.Services;

public class RestaurantService : IRestaurantService
{
    private readonly IAppDbContext _context;

    public RestaurantService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<int> CreateRestaurantAsync(int ownerId, CreateRestaurantDto dto)
    {
        var restaurant = new Restaurant
        {
            OwnerId = ownerId,
            Name = dto.Name,
            Description = dto.Description,
            Address = dto.Address,
            City = dto.City,
            RestaurantType = dto.RestaurantType,
            TotalTables = dto.TotalTables,
            MaxGuestsCapacity = dto.MaxGuestsCapacity,
            HasKidsZone = dto.HasKidsZone,
            IsPetFriendly = dto.IsPetFriendly,
            HasWifi = dto.HasWifi,
            HasParking = dto.HasParking,
            HasSummerTerrace = dto.HasSummerTerrace
        };

        _context.Restaurants.Add(restaurant);
        await _context.SaveChangesAsync();

        return restaurant.Id;
    }

    public async Task<IEnumerable<RestaurantDto>> GetAllAsync(string? city = null, string? type = null, bool? hasKidsZone = null)
    {
        var query = _context.Restaurants.Include(r => r.Owner).AsQueryable();

        // Фильтрация
        if (!string.IsNullOrWhiteSpace(city))
            query = query.Where(r => r.City.ToLower() == city.ToLower());

        if (!string.IsNullOrWhiteSpace(type))
            query = query.Where(r => r.RestaurantType.ToLower() == type.ToLower());

        if (hasKidsZone.HasValue && hasKidsZone.Value)
            query = query.Where(r => r.HasKidsZone);

        return await query.Select(r => new RestaurantDto
        {
            Id = r.Id,
            Name = r.Name,
            Description = r.Description,
            Address = r.Address,
            City = r.City,
            RestaurantType = r.RestaurantType,
            TotalTables = r.TotalTables,
            MaxGuestsCapacity = r.MaxGuestsCapacity,
            HasKidsZone = r.HasKidsZone,
            IsPetFriendly = r.IsPetFriendly,
            HasWifi = r.HasWifi,
            HasParking = r.HasParking,
            HasSummerTerrace = r.HasSummerTerrace,
            OwnerName = $"{r.Owner.FirstName} {r.Owner.LastName}"
        }).ToListAsync();
    }

    public async Task<RestaurantDto?> GetByIdAsync(int id)
    {
        var r = await _context.Restaurants
            .Include(res => res.Owner)
            .FirstOrDefaultAsync(res => res.Id == id);

        if (r == null) return null;

        return new RestaurantDto
        {
            Id = r.Id,
            Name = r.Name,
            Description = r.Description,
            Address = r.Address,
            City = r.City,
            RestaurantType = r.RestaurantType,
            TotalTables = r.TotalTables,
            MaxGuestsCapacity = r.MaxGuestsCapacity,
            HasKidsZone = r.HasKidsZone,
            IsPetFriendly = r.IsPetFriendly,
            HasWifi = r.HasWifi,
            HasParking = r.HasParking,
            HasSummerTerrace = r.HasSummerTerrace,
            OwnerName = $"{r.Owner.FirstName} {r.Owner.LastName}"
        };
    }
}