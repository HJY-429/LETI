/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C'
        },
        secondary: {
          DEFAULT: '#2196F3',
          light: '#64B5F6',
          dark: '#1976D2'
        },
        accent: {
          DEFAULT: '#FF9800',
          light: '#FFB74D',
          dark: '#F57C00'
        },
        warning: '#FF5722',
        success: '#4CAF50',
        danger: '#f44336'
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Noto Sans SC', 'Inter', 'sans-serif']
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #E1F5FE 100%)',
        'gradient-card': 'linear-gradient(135deg, #ffffff 0%, #f8fdf8 100%)',
        'gradient-result': 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)'
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-up': 'scaleUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'count-up': 'countUp 1s ease-out'
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  },
  plugins: []
}
