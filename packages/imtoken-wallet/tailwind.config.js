/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "media", // media：讓裝置在深色模式的時候自動轉換；class：手動切換深色模式。
  prefix: "plasmo-",
  theme: {
    extend: {}
  },
  plugins: []
}