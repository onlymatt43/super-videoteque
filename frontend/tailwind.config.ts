import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0a1214',
        "night-light": '#0f1d20',
        ember: '#ffd700',
        slate: '#8fb3b8'
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 10px 40px rgba(255, 215, 0, 0.35)'
      }
    }
  },
  plugins: []
};

export default config;
