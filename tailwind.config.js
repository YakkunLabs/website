/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./community.html", 
    "./games.html",
    "./blog.html",
    "./contact.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        page: "var(--page)",
        surface: "var(--surface)",
        edge: "var(--edge)", 
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-muted": "var(--ink-muted)",
        accent: "var(--accent)",
      },
      borderRadius: { '2xl': '1rem' },
    },
  },
  plugins: [],
}
