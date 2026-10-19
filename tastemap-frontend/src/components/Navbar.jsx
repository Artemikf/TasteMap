import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, LogOut } from 'lucide-react';
import { getFavorites } from '../utils/favorites';

// Встроенный компонент логотипа
function Logo({ className = "w-8 h-8" }) {
    return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="50" cy="50" r="48" fill="#FF5A1F" />
            <path d="M50 20C38.9543 20 30 28.9543 30 40C30 55 50 78 50 78C50 78 70 55 70 40C70 28.9543 61.0457 20 50 20Z" fill="white" />
            <circle cx="50" cy="38" r="9" fill="#FF5A1F" />
        </svg>
    );
}

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [favCount, setFavCount] = useState(0);

    // Подгружаем количество сохраненных ресторанов и слушаем изменения
    useEffect(() => {
        const updateCount = () => {
            setFavCount(getFavorites().length);
        };
        updateCount();

        window.addEventListener('favoritesUpdated', updateCount);
        return () => window.removeEventListener('favoritesUpdated', updateCount);
    }, []);

    let user = null;
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
            user = JSON.parse(storedUser);
        }
    } catch (e) {
        console.error('Помилка парсингу користувача:', e);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="border-b bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Логотип */}
                <Link to="/" className="flex items-center gap-2">
                    <Logo className="w-8 h-8" />
                    <span className="text-xl font-black text-gray-900">
                        Taste<span className="text-brand">Map</span>
                    </span>
                </Link>

                {/* Навигация */}
                <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
                    <Link to="/register-partner" className="hover:text-brand transition">
                        Зареєструвати заклад
                    </Link>

                    {token ? (
                        <div className="flex items-center gap-4">
                            <Link to="/profile" className="flex items-center gap-2 text-brand font-semibold hover:underline">
                                <User className="w-4 h-4" />
                                <span>{user?.firstName || 'Мій кабінет'}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                title="Вийти"
                                className="text-gray-400 hover:text-red-600 transition"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/register" className="hover:text-brand transition">
                                Зареєструватися
                            </Link>
                            <Link to="/login" className="text-brand hover:underline font-semibold">
                                Вхід
                            </Link>
                        </>
                    )}

                    {/* Кнопка «Избранное» с бейджем количества */}
                    <Link
                        to="/favorites"
                        className="relative p-2 border rounded-xl hover:bg-orange-50 transition text-gray-600 hover:text-brand flex items-center justify-center"
                        title="Улюблені заклади"
                    >
                        <Heart className={`w-5 h-5 transition ${favCount > 0 ? 'fill-brand text-brand' : ''}`} />
                        {favCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-brand text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                {favCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}