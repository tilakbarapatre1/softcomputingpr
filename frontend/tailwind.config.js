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
        forest: {
          50: '#f2f8f5',
          100: '#e1f0e9',
          200: '#c5e2d6',
          300: '#9bcebc',
          400: '#6bb39b',
          500: '#46967f',
          600: '#347866',
          700: '#2a6052',
          800: '#1b3b32',
          900: '#132a24',
          950: '#0a1714',
        },
        brand: {
          light: '#f4f6f4',
          accent: '#84cc16',
          mint: '#dcfce7',
          card: '#ffffff',
          darkCard: '#182420',
          darkBg: '#0e1614',
          darkBorder: '#233831',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(27, 59, 50, 0.06)',
        'glow': '0 0 20px rgba(132, 204, 22, 0.35)',
      }
    },
  },
  plugins: [],
}
