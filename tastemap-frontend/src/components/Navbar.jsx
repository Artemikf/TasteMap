import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';

export default function Navbar() {
    return (
        <header className="border-b bg-white">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Логотип */}
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-brand">
                    <div className="bg-brand text-white p-1.5 rounded-lg">
                        <MapPin className="w-6 h-6 fill-current text-white" />
                    </div>
                    <span>TASTE MAP</span>
                </Link>

                {/* Навигация справа */}
                <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
                    <Link to="/register-partner" className="hover:text-brand transition">
                        Зареєструвати заклад
                    </Link>
                    <Link to="/register" className="hover:text-brand transition">
                        Зареєструватися
                    </Link>
                    <Link to="/login" className="text-brand hover:underline font-semibold">
                        Вхід
                    </Link>
                    <button className="p-2 border rounded-xl hover:bg-gray-50 transition">
                        <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </header>
    );
}