/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // every brand color is an RGB triplet CSS variable (see index.css);
        // white .card/.panel surfaces re-map the same names to dark ink
        paper: 'rgb(var(--paper) / <alpha-value>)',
        ink: {
          950: 'rgb(var(--ink-950) / <alpha-value>)',
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          850: 'rgb(var(--ink-850) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
        },
        mist: {
          DEFAULT: 'rgb(var(--mist) / <alpha-value>)',
          dim: 'rgb(var(--mist-dim) / <alpha-value>)',
          faint: 'rgb(var(--mist-faint) / <alpha-value>)',
        },
        gold: {
          DEFAULT: 'rgb(var(--gold) / <alpha-value>)',
          bright: 'rgb(var(--gold-bright) / <alpha-value>)',
          deep: 'rgb(var(--gold-deep) / <alpha-value>)',
        },
        // navy doubles as the "ink alpha" color for borders and dividers
        navy: {
          DEFAULT: 'rgb(var(--navy) / <alpha-value>)',
          deep: 'rgb(var(--navy-deep) / <alpha-value>)',
        },
        blue: {
          DEFAULT: 'rgb(var(--blue) / <alpha-value>)',
          bright: 'rgb(var(--blue-bright) / <alpha-value>)',
          soft: 'rgb(var(--blue-soft) / <alpha-value>)',
        },
        flag: {
          DEFAULT: '#B31942',
        },
        brass: {
          DEFAULT: '#9C7A2E',
          dim: '#6F5620',
        },
      },
      // `text-gold` is deep teal, not the aqua fill: neon aqua has no contrast as type on white
      textColor: {
        gold: {
          DEFAULT: 'rgb(var(--gold-text) / <alpha-value>)',
          bright: 'rgb(var(--gold-text) / <alpha-value>)',
          deep: 'rgb(var(--gold-deep) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        // section headings: an engraved-feeling serif, like a prospectus
        serif: ['"Source Serif 4"', 'Georgia', '"Times New Roman"', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '0.375rem',
        DEFAULT: '0.5rem',
        md: '0.625rem',
        lg: '0.75rem',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        pulseSoft: 'pulseSoft 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
