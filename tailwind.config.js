import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                serif: ['Playfair Display', 'Merriweather', ...defaultTheme.fontFamily.serif],
            },
            colors: {
                siarsip: {
                    canvas: '#FFFFFF',
                    canvasSoft: '#F9FAFB',
                    terracotta: '#DC2626', // Bright Red
                    terracottaDark: '#991B1B', // Dark Red
                    heroDark: '#7F1D1D', // Deep Red for Hero
                    heroCard: '#FFFFFF',
                    kemhanGold: '#D4AF37', // Kemhan Gold
                }
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                fadeIn: 'fadeIn 0.4s ease-out forwards',
            }
        },
    },

    plugins: [forms],
};
