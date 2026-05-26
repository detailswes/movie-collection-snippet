/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2BD17E",
        error: "#EB5757",
        background: "#093545",
        input: "#224957",
        card: "#092C39",
        white: "#FFFFFF",
      },
    },
    container: {
      center: true,
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};


