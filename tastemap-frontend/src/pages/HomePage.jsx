import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, MapPin, Users, Calendar, Star, Heart,
    Dog, Sun, Baby, Wifi, ParkingCircle, X
} from 'lucide-react';
import api from '../api/axios';
import { getFavorites, toggleFavorite } from '../utils/favorites';

export default function HomePage() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Основні фільтри
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('');
    const [guests, setGuests] = useState('');
    const [bookingDate, setBookingDate] = useState('');

    // Фільтри зручностей (Boolean)
    const [hasWifi, setHasWifi] = useState(false);
    const [isPetFriendly, setIsPetFriendly] = useState(false);
    const [hasKidsZone, setHasKidsZone] = useState(false);
    const [hasParking, setHasParking] = useState(false);
    const [hasSummerTerrace, setHasSummerTerrace] = useState(false);

    // Список избранного
    const [favList, setFavList] = useState([]);

    useEffect(() => {
        fetchRestaurants();
        setFavList(getFavorites());

        // Слушаем обновления избранного из других компонентов
        const updateFavs = () => setFavList(getFavorites());
        window.addEventListener('favoritesUpdated', updateFavs);
        return () => window.removeEventListener('favoritesUpdated', updateFavs);
    }, []);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const response = await api.get('/Restaurant');
            setRestaurants(response.data);
        } catch (err) {
            console.error('Помилка завантаження ресторанів:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFav = (e, restaurantId) => {
        e.preventDefault(); // Запрещаем переход по ссылке карточки
        e.stopPropagation();
        toggleFavorite(restaurantId);
        setFavList(getFavorites());
    };

    // Гнучка фільтрація на клієнті за всіма критеріями
    const filteredRestaurants = restaurants.filter(r => {
        const matchesSearch = !searchTerm ||
            r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.address?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCity = !selectedCity ||
            r.city?.toLowerCase() === selectedCity.toLowerCase();

        const type = r.restaurantType || r.cuisineType || '';
        const matchesCuisine = !selectedCuisine ||
            type.toLowerCase().includes(selectedCuisine.toLowerCase());

        const matchesGuests = !guests || (r.maxGuestsCapacity ? r.maxGuestsCapacity >= Number(guests) : true);

        const matchesWifi = !hasWifi || r.hasWifi;
        const matchesPet = !isPetFriendly || r.isPetFriendly;
        const matchesKids = !hasKidsZone || r.hasKidsZone;
        const matchesParking = !hasParking || r.hasParking;
        const matchesTerrace = !hasSummerTerrace || r.hasSummerTerrace;

        return matchesSearch && matchesCity && matchesCuisine && matchesGuests &&
            matchesWifi && matchesPet && matchesKids && matchesParking && matchesTerrace;
    });

    const resetAllFilters = () => {
        setSearchTerm('');
        setSelectedCity('');
        setSelectedCuisine('');
        setGuests('');
        setBookingDate('');
        setHasWifi(false);
        setIsPetFriendly(false);
        setHasKidsZone(false);
        setHasParking(false);
        setHasSummerTerrace(false);
    };

    const hasActiveFilters = searchTerm || selectedCity || selectedCuisine || guests || bookingDate ||
        hasWifi || isPetFriendly || hasKidsZone || hasParking || hasSummerTerrace;

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Головний банер (Hero Section) */}
            <div className="relative overflow-hidden mb-8 min-h-[480px] flex items-center justify-center text-center shadow-lg">
                <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
                    alt="TasteMap Restaurant Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 text-white w-full">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight">
                        Знайдіть і забронюйте свій <span className="text-brand">ІДЕАЛЬНИЙ</span> столик
                    </h1>
                    <p className="text-xs md:text-sm text-gray-200 mb-8 max-w-xl mx-auto">
                        Обирайте за датою, кількістю гостей, зручностями та типом кухні
                    </p>

                    {/* Мульти-панель фільтрів у банері */}
                    <div className="bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/20 text-gray-800 text-left">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-brand">
                                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Назва або адреса..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-transparent outline-none text-xs text-gray-800 placeholder-gray-400"
                                />
                            </div>

                            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-brand">
                                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full bg-transparent outline-none text-xs text-gray-800 cursor-pointer"
                                >
                                    <option value="">Усі міста</option>
                                    <option value="Київ">Київ</option>
                                    <option value="Львів">Львів</option>
                                    <option value="Одеса">Одеса</option>
                                    <option value="Дніпро">Дніпро</option>
                                    <option value="Харків">Харків</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-brand">
                                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                                <input
                                    type="datetime-local"
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    className="w-full bg-transparent outline-none text-xs text-gray-800"
                                />
                            </div>

                            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-brand">
                                <Users className="w-4 h-4 text-gray-400 shrink-0" />
                                <select
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                    className="w-full bg-transparent outline-none text-xs text-gray-800 cursor-pointer"
                                >
                                    <option value="">Будь-яка кількість</option>
                                    <option value="1">1 гість</option>
                                    <option value="2">2 гості</option>
                                    <option value="3">3-4 гості</option>
                                    <option value="5">5+ гостей</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                            <span className="text-[11px] font-semibold text-gray-400 mr-1">Опції:</span>

                            <button
                                onClick={() => setIsPetFriendly(!isPetFriendly)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${isPetFriendly ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <Dog className="w-3.5 h-3.5" />
                                <span>Pet-Friendly</span>
                            </button>

                            <button
                                onClick={() => setHasSummerTerrace(!hasSummerTerrace)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${hasSummerTerrace ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <Sun className="w-3.5 h-3.5" />
                                <span>Літня тераса</span>
                            </button>

                            <button
                                onClick={() => setHasKidsZone(!hasKidsZone)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${hasKidsZone ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <Baby className="w-3.5 h-3.5" />
                                <span>Дитяча зона</span>
                            </button>

                            <button
                                onClick={() => setHasWifi(!hasWifi)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${hasWifi ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <Wifi className="w-3.5 h-3.5" />
                                <span>Wi-Fi</span>
                            </button>

                            <button
                                onClick={() => setHasParking(!hasParking)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${hasParking ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <ParkingCircle className="w-3.5 h-3.5" />
                                <span>Парковка</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Фільтри за типами кухні */}
            <div className="max-w-6xl mx-auto px-4 mb-6">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        onClick={() => setSelectedCuisine('')}
                        className={`px-5 py-2 rounded-full text-xs font-semibold transition shrink-0 ${selectedCuisine === ''
                                ? 'bg-brand text-white shadow-sm'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        Усі кухни
                    </button>
                    {['Українська', 'Італійська', 'Японська', 'Європейська', 'Азіатська'].map((cuisine) => (
                        <button
                            key={cuisine}
                            onClick={() => setSelectedCuisine(cuisine)}
                            className={`px-5 py-2 rounded-full text-xs font-semibold transition shrink-0 ${selectedCuisine === cuisine
                                    ? 'bg-brand text-white shadow-sm'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {cuisine}
                        </button>
                    ))}
                </div>
            </div>

            {/* Список закладів */}
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        Результати пошуку ({filteredRestaurants.length})
                    </h2>
                    {hasActiveFilters && (
                        <button
                            onClick={resetAllFilters}
                            className="flex items-center gap-1 text-xs text-brand hover:underline font-semibold"
                        >
                            <X className="w-3.5 h-3.5" />
                            <span>Скинути всі фільтри</span>
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-brand border-t-transparent"></div>
                        <p className="mt-4 text-gray-500 text-sm">Завантаження закладів...</p>
                    </div>
                ) : filteredRestaurants.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                        <p className="text-gray-500 font-medium text-sm">Закладів за вашими критеріями не знайдено</p>
                        <button
                            onClick={resetAllFilters}
                            className="mt-3 px-4 py-2 bg-brand text-white rounded-xl text-xs font-semibold hover:bg-brand-hover"
                        >
                            Скинути фільтри
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRestaurants.map((restaurant) => {
                            const isFav = favList.includes(restaurant.id);

                            return (
                                <div
                                    key={restaurant.id}
                                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col group"
                                >
                                    {/* Картинка закладу */}
                                    <div className="relative h-48 overflow-hidden bg-gray-200">
                                        <img
                                            src={restaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"}
                                            alt={restaurant.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />

                                        {/* Інтерактивна кнопка обраного */}
                                        <button
                                            onClick={(e) => handleToggleFav(e, restaurant.id)}
                                            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white text-gray-600 transition shadow-sm z-10"
                                            title={isFav ? "Видалити з обраного" : "Додати в обране"}
                                        >
                                            <Heart className={`w-4 h-4 transition ${isFav ? 'fill-brand text-brand scale-110' : 'text-gray-600 hover:text-brand'}`} />
                                        </button>

                                        <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                                            {restaurant.restaurantType || restaurant.cuisineType || "Ресторан"}
                                        </span>
                                    </div>

                                    {/* Інформація */}
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
                                                <span>м. {restaurant.city}, {restaurant.address}</span>
                                            </p>

                                            <div className="flex items-center gap-2 mb-3 text-gray-400">
                                                {restaurant.isPetFriendly && <Dog className="w-3.5 h-3.5 text-brand" title="Pet Friendly" />}
                                                {restaurant.hasSummerTerrace && <Sun className="w-3.5 h-3.5 text-brand" title="Літня тераса" />}
                                                {restaurant.hasKidsZone && <Baby className="w-3.5 h-3.5 text-brand" title="Дитяча зона" />}
                                                {restaurant.hasWifi && <Wifi className="w-3.5 h-3.5 text-brand" title="Wi-Fi" />}
                                                {restaurant.hasParking && <ParkingCircle className="w-3.5 h-3.5 text-brand" title="Парковка" />}
                                            </div>

                                            <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                                                {restaurant.description || "Чудовий заклад із затишною атмосферою та смачною кухнею."}
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
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}