import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        brand: {
          navy: '#1B2D4A',
          'navy-light': '#243B5C',
          'navy-deep': '#0F1D30',
          gold: '#C5A647',
          green: '#3B8C5E',
        },
        surface: {
          page: '#F7F8FA',
          card: '#FFFFFF',
          stripe: '#FAFBFC',
          hover: '#F0F7FF',
          border: '#E5E8ED',
          'border-light': '#F0F2F5',
        },
        txt: {
          primary: '#1B2D4A',
          secondary: '#6B7A8D',
          tertiary: '#9CA3AF',
        },
        semantic: {
          error: '#DC2626',
          warning: '#EA580C',
          caution: '#D97706',
          success: '#16A34A',
          info: '#2563EB',
          purple: '#7C5CFC',
        },
        header: {
          muted: '#8BA4C4',
        },
      },
    },
  },
  plugins: [],
}

export default config
