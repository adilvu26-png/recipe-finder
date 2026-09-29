/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8ed',
          100: '#ffedd1',
          200: '#ffd699',
          300: '#ffb85c',
          400: '#ff9a2e',
          500: '#f97e0c',
          600: '#e5620a',
          700: '#bf480c',
          800: '#993911',
          900: '#7c3111',
        },
        char: {
          50: '#f6f6f5',
          100: '#e7e6e3',
          200: '#cfccc6',
          300: '#aca69c',
          400: '#847d70',
          500: '#665f54',
          600: '#524c43',
          700: '#433e37',
          800: '#38342f',
          900: '#242220',
        },
        tomato: {
          500: '#d1462f',
          600: '#b83a26',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
