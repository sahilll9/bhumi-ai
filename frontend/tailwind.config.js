/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bhumi: {
          dark: '#229622ff',
          deep: '#2d4a2d',
          primary: '#4ade80',
          soft: '#bbf7d0',
        },
        saffron: {
          light: '#ffedd5',
          DEFAULT: '#f97316',
          dark: '#ea580c',
        },
        earth: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          800: '#292524',
          900: '#1c1917',
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'premium-mesh': 'radial-gradient(at 0% 0%, hsla(120, 50%, 20%, 1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(30, 80%, 30%, 1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(110, 40%, 15%, 1) 0, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
