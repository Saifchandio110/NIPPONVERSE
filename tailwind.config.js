/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: '#FBF8F3',
        navy: { DEFAULT: '#14213D', soft: '#2B3A5C' },
        vermilion: '#C8372D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        jp: ['"Noto Sans JP"', '"Hiragino Sans"', '"Yu Gothic"', 'Meiryo', 'sans-serif'],
        ur: ['"Noto Nastaliq Urdu"', '"Noto Naskh Arabic"', 'Tahoma', 'serif'],
      },
    },
  },
  plugins: [],
};
