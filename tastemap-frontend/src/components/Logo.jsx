import React from 'react';

export default function Logo({ className = "w-10 h-10" }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Помаранчевий круглий фон */}
            <circle cx="50" cy="50" r="48" fill="#FF5A1F" />

            {/* Метка геолокации (Location Pin) */}
            <path
                d="M50 20C38.9543 20 30 28.9543 30 40C30 55 50 78 50 78C50 78 70 55 70 40C70 28.9543 61.0457 20 50 20Z"
                fill="white"
            />

            {/* Вырез в метке (Тарелка/Вилка) */}
            <circle cx="50" cy="38" r="9" fill="#FF5A1F" />

            {/* Маленькая иконка вилки и ножа */}
            <path
                d="M47 34V42M49 34V42M45 34V38C45 39.1046 45.8954 40 47 40H49C50.1046 40 51 39.1046 51 38V34M53 34H54C54.5523 34 55 34.4477 55 35V39C55 40.1046 54.1046 41 53 41V42"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}