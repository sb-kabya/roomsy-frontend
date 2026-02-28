module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          500: '#4f6ef7',
          600: '#3d5ce8',
          700: '#2d4bd4',
          900: '#1a2d8a',
        },
        gold: {
          400: '#f4c842',
          500: '#e8b820',
          600: '#cc9f00',
        },
        dark: {
          800: '#1a1f2e',
          900: '#0f1320',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
