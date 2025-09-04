/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./community.html",
    "./games.html",
    "./blog.html",
    "./contact.html",

    // any additional html files
    "./**/*.html",

    // all your JavaScript files
    "./js/**/*.js",

    // optional if you use a src/ folder or components
    "./src/**/*.{html,js,ts,jsx,tsx,vue,svelte}",
    "./components/**/*.{html,js,ts,jsx,tsx}",
    "./pages/**/*.{html,js,ts,jsx,tsx}",

    // exclude build + deps
    "!./dist/**",
    "!./node_modules/**"
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
        accent: "var(--accent)"
      },
      borderRadius: { '2xl': '1rem' }
    },
  },
  plugins: []
}
