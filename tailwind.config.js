/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atelier: {
          950: '#0d0d0d',
          900: '#161616',
          800: '#222222',
          700: '#333333',
          600: '#525252',
          500: '#737373',
          400: '#a3a3a3',
          300: '#d4d4d4',
          200: '#e5e2dc',
          150: '#ede9e3',
          100: '#f4f1eb',
          50: '#faf8f5',
          gold: '#c5a880',
          'gold-dark': '#a3845b',
          'gold-light': '#dfcdb4'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'luxury': '0.15em',
        'super-wide': '0.25em'
      }
    },
  },
  plugins: [],
}
