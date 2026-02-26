/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        avatar: {
          violet:  '#8B5CF6',
          pink:    '#EC4899',
          sky:     '#0EA5E9',
          emerald: '#10B981',
          amber:   '#F59E0B',
          rose:    '#F43F5E',
          indigo:  '#6366F1',
          teal:    '#14B8A6',
          orange:  '#F97316',
          lime:    '#84CC16',
          cyan:    '#06B6D4',
          fuchsia: '#D946EF',
        },
      },
      fontFamily: {
        display: ['system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
