/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#060A18',
          900: '#090E20',
          850: '#0D142C',
          800: '#121B3A',
          700: '#1A2650',
        },
        mist: {
          DEFAULT: '#E8ECF4',
          dim: '#A6B0C5',
          faint: '#606D89',
        },
        azure: {
          DEFAULT: '#2E9BFF',
          bright: '#66B8FF',
          deep: '#0A4E96',
        },
        brass: {
          DEFAULT: '#C3A878',
          dim: '#8C7C58',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // display headings: same grotesque as body, sized/weighted up (Morpho-style)
        serif: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '0.625rem',
        DEFAULT: '0.75rem',
        md: '1rem',
        lg: '1.25rem',
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
