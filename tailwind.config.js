/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: ["./src/**/*.{html,js,ts,tsx,jsx}"],
  theme: {
    extend: {
      colors: {
        darkBlue: "#071952", // #071952
        tealGreen: "#088395", // #088395
        cyan: "#37B7C3", // #37B7C3
        lightGray: "#EBF4F6", // #EBF4F6
        // dark mode Black
        deepBlack: "#121212",
        lightBlack1: "#1E1E1E",
        lightBlack2: "#232323",
        lightBlack3: "#252525",
        lightBlack4: "#272727",
        // dark mode Gray
        deepGray: "#2C2C2C",
        lightGray1: "#2E2E2E",
        lightGray2: "#333333",
        lightGray3: "#363636",
        lightGray4: "#383838",
      },
    },
  },
  plugins: [],
};
