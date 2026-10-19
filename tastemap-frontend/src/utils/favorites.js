// Получить список ID избранных ресторанов
export const getFavorites = () => {
    try {
        const saved = localStorage.getItem('tastemap_favorites');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Помилка читання обраного:', e);
        return [];
    }
};

// Проверить, находится ли ресторан в избранном
export const isFavorite = (restaurantId) => {
    const favorites = getFavorites();
    return favorites.includes(restaurantId);
};

// Переключить состояние (добавить / удалить)
export const toggleFavorite = (restaurantId) => {
    let favorites = getFavorites();
    if (favorites.includes(restaurantId)) {
        favorites = favorites.filter(id => id !== restaurantId);
    } else {
        favorites.push(restaurantId);
    }
    localStorage.setItem('tastemap_favorites', JSON.stringify(favorites));

    // Отправляем кастомное событие, чтобы Navbar и другие компоненты мгновенно перерисовали счетчик
    window.dispatchEvent(new Event('favoritesUpdated'));
    return favorites.includes(restaurantId);
};