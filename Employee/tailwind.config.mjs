/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        meta: {
          primary: '#09090b',          // Pure Black for CTA & primary elements
          'primary-dark': '#18181b',   // Near Black hover
          'primary-soft': '#f4f4f5',   // Light gray background
          surface: '#f8fafc',          // Clean slate canvas
          'surface-dark': '#ffffff',   // Card background
          ink: '#09090b',              // Primary text color
          'ink-deep': '#000000',       // Heading black
          slate: '#475569',            // Subtitle text
          steel: '#64748b',            // Muted secondary text
          stone: '#94a3b8',            // Subtle placeholder text
          hairline: '#e2e8f0',         // Clean thin border
          'hairline-soft': '#f1f5f9',    // Light hairline border
          accent: '#09090b',           // Black accent
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '3xl': '1.5rem',
        '2xl': '1rem',
      },
      fontFamily: {
        sans: ['Inter', 'Optimistic VF', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
