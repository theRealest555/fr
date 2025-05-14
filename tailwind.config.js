/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8f1',
          100: '#feecdc',
          200: '#fcd9bd',
          300: '#fdba8c',
          400: '#ff8a4c',
          500: '#ff5a1f', // TE Connectivity orange
          600: '#d03801',
          700: '#b43403',
          800: '#8a2c0d',
          900: '#771d1d',
        },
        secondary: {
          50: '#f9fafb',
          100: '#f4f5f7',
          200: '#e5e7eb',
          300: '#d2d6dc',
          400: '#9fa6b2',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#252f3f',
          900: '#161e2e',
        },
        "te-orange": "#ff5a1f",
        "te-white": "#ffffff",
        "te-black": "#000000",
      }
    }
  },
  plugins: [],
}
