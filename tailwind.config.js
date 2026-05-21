/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'med-bg': 'var(--med-bg)',
        'med-bg-alt': 'var(--med-bg-alt)',
        'med-card': 'var(--med-card)',
        'med-card-sec': 'var(--med-card-sec)',
        'med-border': 'var(--med-border)',
        'med-primary': 'var(--med-primary)',
        'med-teal': 'var(--med-teal)',
        'med-purple': 'var(--med-purple)',
        'med-success': 'var(--med-success)',
        'med-warning': 'var(--med-warning)',
        'med-danger': 'var(--med-danger)',
        'med-text': 'var(--med-text)',
        'med-text-muted': 'var(--med-text-muted)'
      },
      fontFamily: {
        sans: ['Google Sans', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'med-glow': '0 0 20px rgba(6, 182, 212, 0.15)',
        'teal-glow': '0 0 20px rgba(20, 184, 166, 0.15)',
        'ai-glow': '0 0 20px rgba(139, 92, 246, 0.15)',
        'alert-glow': '0 0 20px rgba(239, 68, 68, 0.25)'
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite linear'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    }
  },
  plugins: []
}
