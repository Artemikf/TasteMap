import React, { useState } from 'react';

export default function HelpCenterPage() {
    const [submitted, setSubmitted] = useState(false);

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-extrabold mb-4 text-gray-900">Центр підтримки TasteMap</h1>
            <p className="text-sm text-gray-600 mb-8">Маєте запитання щодо бронювання чи роботи сервісу? Напишіть нам!</p>

            {submitted ? (
                <div className="p-6 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm font-semibold">
                    Дякуємо! Ваше повідомлення відправлено. Ми відповімо вам на пошту протягом 24 годин.
                </div>
            ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="bg-white p-8 border rounded-3xl space-y-4 shadow-sm">
                    <div>
                        <label className="block text-xs font-semibold mb-1">Ваше ім'я</label>
                        <input type="text" required className="w-full p-3 border rounded-xl text-sm outline-none focus:border-brand" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold mb-1">Email для відповіді</label>
                        <input type="email" required className="w-full p-3 border rounded-xl text-sm outline-none focus:border-brand" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold mb-1">Повідомлення</label>
                        <textarea rows="4" required className="w-full p-3 border rounded-xl text-sm outline-none focus:border-brand"></textarea>
                    </div>
                    <button type="submit" className="w-full py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand-hover transition">
                        Надіслати запит
                    </button>
                </form>
            )}
        </div>
    );
}