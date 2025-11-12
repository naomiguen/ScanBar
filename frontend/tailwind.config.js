/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom colors (optional)
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      // Custom blur values
      blur: {
        '60': '60px',
      },
      // Custom max-width
      maxWidth: {
        '7xl': '1200px',
      },
      // Custom spacing
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      // Custom transition duration
      transitionDuration: {
        '200': '200ms',
        '220': '220ms',
      },
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      // Custom keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Custom box shadows
      boxShadow: {
        'blue-glow': '0 10px 40px rgba(37, 99, 235, 0.3)',
        'indigo-glow': '0 10px 40px rgba(79, 70, 229, 0.3)',
        'purple-glow': '0 10px 40px rgba(124, 58, 237, 0.3)',
      },
    },
  },
  plugins: [
    // Plugin untuk line-clamp (text truncation)
    // require('@tailwindcss/line-clamp'),
    // Plugin untuk forms (optional, untuk styling form lebih baik)
    // require('@tailwindcss/forms'),
  ],
}
