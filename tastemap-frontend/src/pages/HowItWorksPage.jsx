import React from 'react';

export default function HowItWorksPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900">Як працює TasteMap</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm text-center">
                    <div className="w-12 h-12 bg-orange-100 text-brand font-bold rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl">1</div>
                    <h3 className="font-bold text-gray-900 mb-2">Обирайте заклад</h3>
                    <p className="text-xs text-gray-500">Шукайте за містом, типом кухні, фотографіями та зручностями (Wi-Fi, дитяча зона).</p>
                </div>
                <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm text-center">
                    <div className="w-12 h-12 bg-orange-100 text-brand font-bold rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl">2</div>
                    <h3 className="font-bold text-gray-900 mb-2">Бронюйте в 1 клік</h3>
                    <p className="text-xs text-gray-500">Вказуйте дату, час та кількість гостей. Бронювання підтверджується миттєво.</p>
                </div>
                <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm text-center">
                    <div className="w-12 h-12 bg-orange-100 text-brand font-bold rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl">3</div>
                    <h3 className="font-bold text-gray-900 mb-2">Насолоджуйтесь</h3>
                    <p className="text-xs text-gray-500">Завітайте до закладу у призначений час та залишайте свій відгук на платформі.</p>
                </div>
            </div>
        </div>
    );
}