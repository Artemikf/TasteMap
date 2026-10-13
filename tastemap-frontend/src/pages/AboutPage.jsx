import React from 'react';

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
            <h1 className="text-3xl font-extrabold mb-6">Про TasteMap</h1>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
                TasteMap — це сучасний український онлайн-сервіс для пошуку закладів відпочинку та миттєвого бронювання столиків.
                Наша місія — поєднати гурманів із найкращими ресторанами, кав'ярнями та барами по всій країні.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                    <h3 className="text-2xl font-extrabold text-brand mb-1">2500+</h3>
                    <p className="text-xs text-gray-600">Партнерських закладів</p>
                </div>
                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                    <h3 className="text-2xl font-extrabold text-brand mb-1">100k+</h3>
                    <p className="text-xs text-gray-600">Успішних бронювань</p>
                </div>
                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                    <h3 className="text-2xl font-extrabold text-brand mb-1">24/7</h3>
                    <p className="text-xs text-gray-600">Підтримка користувачів</p>
                </div>
            </div>
        </div>
    );
}