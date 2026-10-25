/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          raised: 'rgb(var(--surface-raised) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
        },
        atelier: {
          950: 'rgb(var(--atelier-950) / <alpha-value>)',
          900: 'rgb(var(--atelier-900) / <alpha-value>)',
          800: 'rgb(var(--atelier-800) / <alpha-value>)',
          700: 'rgb(var(--atelier-700) / <alpha-value>)',
          600: 'rgb(var(--atelier-600) / <alpha-value>)',
          500: 'rgb(var(--atelier-500) / <alpha-value>)',
          400: 'rgb(var(--atelier-400) / <alpha-value>)',
          300: 'rgb(var(--atelier-300) / <alpha-value>)',
          200: 'rgb(var(--atelier-200) / <alpha-value>)',
          150: 'rgb(var(--atelier-150) / <alpha-value>)',
          100: 'rgb(var(--atelier-100) / <alpha-value>)',
          50: 'rgb(var(--atelier-50) / <alpha-value>)',
          gold: 'rgb(var(--accent) / <alpha-value>)',
          'gold-dark': 'rgb(var(--accent-hover) / <alpha-value>)',
          'gold-light': 'rgb(var(--accent-soft) / <alpha-value>)',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.15em',
        'super-wide': '0.25em',
      },
    },
  },
  plugins: [],
}
