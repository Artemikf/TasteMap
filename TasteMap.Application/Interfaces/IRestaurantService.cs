using TasteMap.Application.DTOs.Restaurants;

namespace TasteMap.Application.Interfaces;

public interface IRestaurantService
{
    // Передаем OwnerId, чтобы привязать ресторан к текущему авторизованному пользователю
    Task<int> CreateRestaurantAsync(int ownerId, CreateRestaurantDto dto);
}