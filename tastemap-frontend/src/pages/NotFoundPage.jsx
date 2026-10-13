import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';
import Logo from '../components/Logo';

export default function NotFoundPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gray-50">
            <div className="max-w-md w-full text-center">
                {/* Крупный блок 404 с логотипом посередине */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="text-8xl md:text-9xl font-black text-gray-900 tracking-tighter">
                        4
                    </span>
                    <div className="w-20 h-20 md:w-28 md:28 animate-bounce transition duration-500 flex items-center justify-center">
                        <Logo className="w-full h-full shadow-xl rounded-full" />
                    </div>
                    <span className="text-8xl md:text-9xl font-black text-gray-900 tracking-tighter">
                        4
                    </span>
                </div>

                {/* Текст ошибки */}
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                    Cторінку не знайдено
                </h1>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    Здається, цей столик вже зайнятий або сторінку було перенесено. Не хвилюйтеся, на TasteMap ще багато чудових закладів!
                </p>

                {/* Кнопки возврата */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand hover:bg-brand-hover text-white font-semibold rounded-2xl text-xs transition shadow-md"
                    >
                        <Home className="w-4 h-4" />
                        <span>На головну</span>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-2xl text-xs transition border border-gray-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Повернутися назад</span>
                    </button>
                </div>
            </div>
        </div>
    );
}