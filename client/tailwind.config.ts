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
        background: '#0A0A0A',
        surface: '#111111',
        primary: {
          DEFAULT: '#3B82F6',
          100: '#DBEAFE',
          500: '#3B82F6',
        },
        accent: '#60A5FA',
        border: 'rgba(255, 255, 255, 0.1)',
        muted: {
          DEFAULT: '#1F1F1F',
          foreground: '#9CA3AF',
        },
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(59, 130, 246, 0.4)',
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

