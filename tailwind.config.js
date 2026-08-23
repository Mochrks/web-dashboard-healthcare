/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'forest-grove': 'var(--color-forest-grove)',
        'pine-shadow': 'var(--color-pine-shadow)',
        'ink-black': 'var(--color-ink-black)',
        graphite: 'var(--color-graphite)',
        'slate-mid': 'var(--color-slate-mid)',
        'mist-gray': 'var(--color-mist-gray)',
        'pure-white': 'var(--color-pure-white)',
        'shadow-smoke': 'var(--color-shadow-smoke)',
        // Retain legacy semantic names temporarily mapping to new tokens to prevent breaking the whole app instantly
        'med-bg': 'var(--med-bg)',
        'med-bg-alt': 'var(--med-bg-alt)',
        'med-card': 'var(--med-card)',
        'med-card-sec': 'var(--med-card-sec)',
        'med-border': 'var(--med-border)',
        'med-primary': 'var(--med-primary)',
        'med-primary-dark': 'var(--med-primary-dark)',
        'med-primary-light': 'var(--med-primary-light)',
        'med-teal': 'var(--med-teal)',
        'med-purple': 'var(--med-purple)',
        'med-success': 'var(--med-success)',
        'med-warning': 'var(--med-warning)',
        'med-danger': 'var(--med-danger)',
        'med-info': 'var(--med-info)',
        'med-text': 'var(--med-text)',
        'med-text-muted': 'var(--med-text-muted)'
      },
      borderRadius: {
        tags: '9999px',
        cards: '20px',
        icons: '12px',
        inputs: '8px',
        buttons: '9999px',
        'large-cards': '24px',
        testimonial: '20px',
        // Legacy fallbacks
        card: '20px',
        btn: '9999px',
        modal: '20px',
        badge: '9999px'
      },
      fontFamily: {
        sans: [
          'Geist',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        serif: [
          '"Libre Caslon Text"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        mono: [
          '"Geist Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      },
      boxShadow: {
        subtle: '0px 1px 2px 0px inset rgba(0, 0, 0, 0.25)',
        'subtle-2': '0px 0px 1px 0px rgba(0, 0, 0, 0.35)',
        'subtle-3': '0px 1px 1px 0px rgba(0, 0, 0, 0.15)',
        'subtle-4': '0px 1px 2px 0px inset rgba(255, 255, 255, 0.75)',
        floating: '0px 0px 1px 0px rgba(0, 0, 0, 0.35), 0px 1px 2px 0px inset rgba(0, 0, 0, 0.25)',
        'btn-dark':
          '0px 1px 1px 0px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px inset rgba(255, 255, 255, 0.75)',
        // Legacy
        'apple-subtle':
          '0px 0px 1px 0px rgba(0, 0, 0, 0.35), 0px 1px 2px 0px inset rgba(0, 0, 0, 0.25)',
        'apple-hover':
          '0px 0px 1px 0px rgba(0, 0, 0, 0.35), 0px 2px 4px 0px inset rgba(0, 0, 0, 0.25)',
        'med-glow': '0px 0px 1px 0px rgba(0, 0, 0, 0.35)',
        'teal-glow': '0px 0px 1px 0px rgba(0, 0, 0, 0.35)',
        'ai-glow': '0px 0px 1px 0px rgba(0, 0, 0, 0.35)',
        'alert-glow': '0px 0px 1px 0px rgba(0, 0, 0, 0.35)'
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
