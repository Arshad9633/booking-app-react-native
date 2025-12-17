/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Updated to the Dark Background from the Salon image
        primary: "#121212", 
        secondary: "#1E1E1E",
        
        // Updated text colors to neutral Grays/Whites (removing the blue tint)
        light: {
          100: "#F5F5F5", // Main White text
          200: "#E0E0E0", // Secondary text
          300: "#9E9E9E", // Muted text
        },
        dark: {
          100: "#2C2C2C", // Lighter card background
          200: "#000000", // Pure black
        },
        
        // Updated to the Gold color found in the logo and buttons
        accent: "#FFC107", 
      },
    },
  },
  plugins: [],
};