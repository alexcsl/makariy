/* eslint-disable no-undef */
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
      },
      backdropBlur: {
        sm: '2px',
      },
    },
  },
  plugins: [],
}
