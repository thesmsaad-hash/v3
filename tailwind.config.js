/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'north-bg': '#F3F1EB',
        'north-dark-sand': '#DFDBCE',
        'north-black': '#000000',
        'north-lime': '#D9FF3F',
        'north-green-dark': '#9FCB1F',
        'north-gray': '#54595F',
        'north-light-gray': '#A0A0A0',
        'north-text': '#7A7A7A',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      maxWidth: {
        'container': '1300px',
      },
      borderWidth: {
        '1': '1px',
      }
    },
  },
  plugins: [],
}
