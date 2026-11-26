/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        head: ['var(--font-head)', 'Georgia', 'serif'],
      },
      colors: {
        black: {
          DEFAULT: '#000',
          100: '#010103',
          200: '#0E0E10',
          300: '#1C1C21',
          500: '#3A3A49',
          600: '#1A1A1A',
        },
        white: {
          DEFAULT: '#FFFFFF',
          800: '#E4E4E6',
          700: '#D6D9E9',
          600: '#AFB0B6',
          500: '#62646C',
        },
        // Semantic, theme-aware tokens backed by CSS variables (see app/globals.css).
        // These flip value when the `.dark` class is toggled by next-themes, so
        // `bg-base`/`bg-surface`/`text-primary`/etc. work the same in light and dark.
        base: 'var(--bg-base)',
        inverse: 'var(--bg-base)', // text on a filled button ("text-base" would mean a font size)
        surface: 'var(--bg-surface)',
        'surface-alt': 'var(--bg-surface-alt)',
        line: 'var(--border-subtle)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        faint: 'var(--text-faint)',
        stage: 'var(--bg-stage)',
        chip: 'var(--chip)',
        blueprint: 'var(--blueprint)',
        'blueprint-ink': 'var(--blueprint-ink)',
        badge: 'var(--badge)',
        'inverse-muted': 'var(--text-inverse-muted)',
        'line-inverse': 'var(--line-inverse)',
        veil: 'var(--veil)',
        'on-veil': 'var(--on-veil)',
      },
      backgroundImage: {
        terminal: "url('/assets/terminal.png')",
      },
    },
  },
  plugins: [],
};
