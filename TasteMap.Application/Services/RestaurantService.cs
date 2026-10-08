using System;
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
            OwnerId = ownerId, // Привязываем к владельцу
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
}