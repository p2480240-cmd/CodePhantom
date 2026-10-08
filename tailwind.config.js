/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        phantom: {
          midnight: '#080D1B',
          deep: '#0B1226',
          card: '#0F172A',
          hover: '#172038',
          purple: '#8B5CF6',
          violet: '#A78BFA',
          cyan: '#22D3EE',
          white: '#F1F5F9',
          teal: '#14B8A6',
          amber: '#FBBF24',
          crimson: '#FB7185',
          border: 'rgba(139, 92, 246, 0.18)',
          glow: 'rgba(34, 211, 238, 0.25)',
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.35)',
        'glow-teal': '0 0 25px -5px rgba(20, 184, 166, 0.35)',
        'glow-card': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
