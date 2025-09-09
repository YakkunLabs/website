/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./community.html",
    "./games.html",
    "./game.html",
    "./blog.html",
    "./contact.html",
    "./login.html",
    "./register.html",
    "./js/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx,vue}"
  ],
  theme: {
    screens: {
      'xs': '375px',    // Extra small devices (small phones)
      'sm': '480px',    // Small devices (phones)
      'md': '768px',    // Medium devices (tablets)
      'lg': '1024px',   // Large devices (desktops)
      'xl': '1280px',   // Extra large devices (large desktops)
      '2xl': '1440px',  // 2x extra large devices (wide screens)
      '3xl': '1920px',  // Ultra wide screens
      // Max-width variants
      'max-xs': {'max': '374px'},
      'max-sm': {'max': '479px'},
      'max-md': {'max': '767px'},
      'max-lg': {'max': '1023px'},
      'max-xl': {'max': '1279px'},
      'max-2xl': {'max': '1439px'},
    },
    extend: {
      colors: {
        page: "var(--page-gradient)",
        surface: "var(--surface)",
        edge: "var(--edge)",
        'edge-soft': "var(--edge-soft)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-muted": "var(--ink-muted)",
        accent: "var(--accent)",
        "accent-2": "var(--accent-2)",
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      borderRadius: { 
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      minHeight: {
        'screen-75': '75vh',
        'screen-50': '50vh',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
}
