/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Kumbh Sans', 'sans-serif'],
        kumbh: ['Kumbh Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#C8EE44',
          foreground: '#000000',
        },
        background: '#FFFFFF',
        surface: '#FFFFFF',
        'brand-lime': '#C8EE44',
        'brand-gray': '#929EAE',
        'brand-dark': '#1B212D',
        'brand-green': '#29A073',
      },
    },
  },
  plugins: [],
}
