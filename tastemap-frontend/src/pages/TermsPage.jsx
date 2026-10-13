import React from 'react';

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
            <h1 className="text-3xl font-extrabold mb-6">Правила та умови використання</h1>
            <div className="space-y-4 text-sm text-gray-600">
                <p>Ласкаво просимо до TasteMap! Користуючись нашим сервісом, ви погоджуєтеся з наступними правилами:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Бронювання столиків є безкоштовним для користувачів.</li>
                    <li>У разі скасування візиту користувач зобов'язаний скасувати бронювання в особистому кабінеті.</li>
                    <li>Адміністрація залишає за собою право блокувати акаунти за нез'явлення без попередження.</li>
                </ul>
            </div>
        </div>
    );
}