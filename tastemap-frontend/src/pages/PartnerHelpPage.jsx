import React from 'react';
import { Link } from 'react-router-dom';

export default function PartnerHelpPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-extrabold mb-4 text-gray-900">База знань для рестораторів</h1>
            <p className="text-sm text-gray-600 mb-8">Як керувати бронюваннями та налаштувати сторінку закладу</p>

            <div className="space-y-4">
                <details className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <summary className="font-bold text-sm cursor-pointer text-gray-800">Як додати свій ресторан на TasteMap?</summary>
                    <p className="text-xs text-gray-600 mt-2">Зареєструйте акаунт як власник закладу та перейдіть у панель керування `/dashboard`.</p>
                </details>
                <details className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <summary className="font-bold text-sm cursor-pointer text-gray-800">Як бачити нові бронювання гостей?</summary>
                    <p className="text-xs text-gray-600 mt-2">Усі вхідні заявки з'являються у вкладці "Вхідні бронювання" кабінету партнера в реальному часі.</p>
                </details>
            </div>

            <div className="mt-8 text-center">
                <Link to="/register-partner" className="inline-block px-6 py-3 bg-brand text-white font-semibold rounded-xl text-xs shadow-md hover:bg-brand-hover">
                    Зареєструвати свій заклад
                </Link>
            </div>
        </div>
    );
}