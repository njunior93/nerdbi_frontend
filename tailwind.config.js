/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent)',
        body: 'var(--text)',
        heading: 'var(--text-h)',
        canvas: 'var(--bg)',
        outline: 'var(--border)',
      },
      boxShadow: {
        card: 'var(--shadow)',
      },
    },
  },
  plugins: [],
}

