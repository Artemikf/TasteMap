import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { getFavorites, toggleFavorite } from '../utils/favorites';

export default function FavoritesPage() {
    const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        const favIds = getFavorites();
        if (favIds.length === 0) {
            setFavoriteRestaurants([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get('/Restaurant');
            // Фильтруем заведения, чей ID есть в массиве избранного
            const filtered = response.data.filter(r => favIds.includes(r.id));
            setFavoriteRestaurants(filtered);
        } catch (err) {
            console.error('Помилка завантаження обраних закладів:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = (id) => {
        toggleFavorite(id);
        loadFavorites();
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 min-h-[70vh]">
            <div className="flex items-center gap-3 mb-8 border-b pb-4">
                <div className="p-3 bg-orange-100 rounded-2xl text-brand">
                    <Heart className="w-6 h-6 fill-brand" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Улюблені заклади</h1>
                    <p className="text-xs text-gray-500">Ваша особиста колекція збережених ресторанів</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-16">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-brand border-t-transparent"></div>
                    <p className="mt-4 text-gray-500 text-sm">Завантаження вашої колекції...</p>
                </div>
            ) : favoriteRestaurants.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 max-w-md mx-auto p-8 shadow-sm">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Список обраного порожній</h3>
                    <p className="text-xs text-gray-500 mb-6">
                        Натискайте на сердечко на картці будь-якого ресторану, щоб зберегти його сюди.
                    </p>
                    <Link
                        to="/"
                        className="inline-block px-6 py-3 bg-brand text-white font-semibold rounded-xl text-xs hover:bg-brand-hover transition shadow-sm"
                    >
                        Перейти до вибору ресторанів
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteRestaurants.map((restaurant) => (
                        <div
                            key={restaurant.id}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col group relative"
                        >
                            {/* Картинка */}
                            <div className="relative h-48 overflow-hidden bg-gray-200">
                                <img
                                    src={restaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                <button
                                    onClick={() => handleRemove(restaurant.id)}
                                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm"
                                    title="Видалити з обраного"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Информация */}
                            <div className="p-5 flex flex-col flex-grow justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand transition">
                                            {restaurant.name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span>{restaurant.rating || "4.8"}</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                        <span>{restaurant.address || restaurant.city}</span>
                                    </p>
                                </div>

                                <Link
                                    to={`/restaurant/${restaurant.id}`}
                                    className="w-full py-2.5 bg-orange-50 hover:bg-brand hover:text-white text-brand font-semibold rounded-xl text-sm text-center transition block"
                                >
                                    Забронювати столик
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}