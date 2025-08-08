/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tier': {
          'iron': '#74634C',
          'bronze': '#B87333',
          'silver': '#C0C0C0',
          'gold': '#FFD700',
          'platinum': '#00CED1',
          'emerald': '#50C878',
          'diamond': '#B9F2FF',
          'master': '#9932CC',
          'grandmaster': '#FF6B6B',
          'challenger': '#F7DC6F',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      backdropBlur: {
        'xs': '2px',
      },
      fontFamily: {
        'game': ['Orbitron', 'monospace'],
      }
    },
  },
  plugins: [],
}