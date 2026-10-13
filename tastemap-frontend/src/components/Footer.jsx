import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[#1A1A1A] text-gray-300 pt-12 pb-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div>
                    <h4 className="text-brand font-bold mb-4">Підтримка</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link to="/register" className="hover:text-white transition">Реєстрація</Link></li>
                        <li><Link to="/forgot-password" className="hover:text-white transition">Забули пароль?</Link></li>
                        <li><Link to="/help" className="hover:text-white transition">Зв'язатися з центром допомоги</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-brand font-bold mb-4">Правила та налаштування</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link to="/privacy" className="hover:text-white transition">Конфіденційність і файли cookie</Link></li>
                        <li><Link to="/terms" className="hover:text-white transition">Правила та умови</Link></li>
                        <li><Link to="/help" className="hover:text-white transition">Розв'язання суперечок</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-brand font-bold mb-4">Партнерам</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link to="/partner-help" className="hover:text-white transition">Допомога партнерам</Link></li>
                        <li><Link to="/register-partner" className="hover:text-white transition">Зареєструвати свій заклад</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-brand font-bold mb-4">Загальна інформація</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><Link to="/about" className="hover:text-white transition">Про нас</Link></li>
                        <li><Link to="/how-it-works" className="hover:text-white transition">Як ми працюємо</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} TasteMap. Всі права захищено.
            </div>
        </footer>
    );
}