/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#FF5722', //  фирменный оранжевый
                    hover: '#E64A19',
                }
            }
        },
    },
    plugins: [],
}