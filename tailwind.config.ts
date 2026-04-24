import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#f97316',
        canvas: '#0f172a',
        node: '#1e293b',
        border: '#334155',
      },
    },
  },
}

export default config