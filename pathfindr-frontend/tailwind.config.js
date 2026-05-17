/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#fbf8fc',
        foreground: '#1b1b1e',
        primary: {
          DEFAULT: '#000317',
          foreground: '#ffffff',
          container: '#0f1c3f',
        },
        secondary: {
          DEFAULT: '#ab3500',
          foreground: '#ffffff',
          container: '#fe6a34',
        },
        muted: {
          DEFAULT: '#f5f3f6',
          foreground: '#45464e',
        },
        accent: {
          DEFAULT: '#00C9A7',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ba1a1a',
          foreground: '#ffffff',
        },
        border: '#c6c6cf',
        input: '#e4e2e5',
        ring: '#515d84',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}
