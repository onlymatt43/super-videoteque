import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0b0b12',
        "night-light": '#151524',
        ember: '#e50914',
        slate: '#9ea7c3'
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 10px 40px rgba(229, 9, 20, 0.35)'
      }
    }
  },
  plugins: []
};

export default config;
