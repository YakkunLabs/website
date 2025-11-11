import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B1020',
        surface: '#111827',
        primary: {
          DEFAULT: '#6D28D9',
          100: '#EDE9FE',
          500: '#6D28D9',
        },
        accent: '#06B6D4',
        border: 'rgba(229, 231, 235, 0.1)',
        muted: {
          DEFAULT: '#1F2937',
          foreground: '#9CA3AF',
        },
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(90deg, #6D28D9 0%, #06B6D4 100%)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(109, 40, 217, 0.4)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0, -5px, 0)' },
          '50%': { transform: 'translate3d(0, 5px, 0)' },
        },
      },
      animation: {
        float: 'float 10s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
};

export default config;

