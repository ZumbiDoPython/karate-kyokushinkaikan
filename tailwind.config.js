/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {
    fontSize: {
      'info3': '1.127rem',
      'info2': '1.300rem',
      'info': '1.038rem',
      'title': '4.500rem',
      'subtitle':'2.275rem',
    }
  } },
  plugins: [],
};

