import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
            <h1 className="text-3xl font-extrabold mb-6">Політика конфіденційності та файли cookie</h1>
            <p className="text-sm text-gray-600 mb-4">
                Платформа TasteMap поважає вашу приватність і зобов’язується захищати особисті дані користувачів.
            </p>
            <div className="space-y-4 text-sm text-gray-600">
                <h2 className="text-lg font-bold text-gray-900">1. Які дані ми збираємо</h2>
                <p>Ми збираємо ім'я, прізвище, електронну адресу та номер телефону при реєстрації й оформленні бронювань.</p>
                <h2 className="text-lg font-bold text-gray-900">2. Використання файлів Cookie</h2>
                <p>Файли cookie використовуються для збереження вашої авторизації, мовних налаштувань та покращення UX.</p>
            </div>
        </div>
    );
}