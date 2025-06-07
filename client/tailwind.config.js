/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff9e6',
          100: '#ffecb3',
          200: '#ffe080',
          300: '#ffd34d',
          400: '#ffc61a',
          500: '#FF9933',
          600: '#e6ac00',
          700: '#b38600',
          800: '#4d3900',
          900: '#1a1300',
        },
        maroon: {
          50: '#ffe6e6',
          100: '#ffb3b3',
          200: '#ff8080',
          300: '#ff4d4d',
          400: '#ff1a1a',
          500: '#800000',
          600: '#660000',
          700: '#4d0000',
          800: '#330000',
          900: '#1a0000',
        },
        ochre: {
          50: '#fff8e6',
          100: '#ffeab3',
          200: '#ffdc80',
          300: '#ffce4d',
          400: '#CD7F32',
          500: '#e6a800',
          600: '#b38300',
          700: '#805e00',
          800: '#4d3800',
          900: '#1a1300',
        },
        primary: '#800000', // maroon
        secondary: '#FF9933', // saffron
        accent: '#CD7F32', // ochre
        dark: '#333333',
        light: '#FFF9E6',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'mandala-pattern': "url('/src/assets/mandala-pattern.svg')",
        'om-symbol': "url('/src/assets/om-symbol.svg')",
      },
    },
  },
  safelist: [
    'bg-maroon-500',
    'bg-saffron-500',
    'bg-ochre-400',
    'text-maroon-500',
    'text-saffron-500',
    'text-ochre-400',
    'border-maroon-500',
    'border-saffron-500',
    'border-ochre-400',
  ],
  plugins: [],
}
