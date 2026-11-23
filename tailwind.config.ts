import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0f0f10', card: '#1c1d20', elevated: '#222428' },
        accent: { blue: '#3b82f6', emerald: '#10b981' },
        border: { DEFAULT: '#2d2f36' },
        text: { primary: '#ffffff', secondary: '#9ca3af' },
      },
    },
  },
  plugins: [],
};
export default config;
