/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        "study-light": {
          "primary": "#174c43", "primary-content": "#ffffff",
          "secondary": "#c7a66a", "secondary-content": "#2c2418",
          "accent": "#a9694f", "accent-content": "#ffffff",
          "neutral": "#283430", "neutral-content": "#f7f5ef",
          "base-100": "#fffefa", "base-200": "#f6f4ed", "base-300": "#e7e2d7", "base-content": "#283430",
          "info": "#3978a8", "success": "#39876b", "warning": "#d3912c", "error": "#c9554d",
          "--rounded-box": "1.25rem", "--rounded-btn": "0.75rem", "--rounded-badge": "1rem"
        }
      },
      {
        "study-dark": {
          "primary": "#82c6ae", "primary-content": "#123c38",
          "secondary": "#d9bb7c", "secondary-content": "#382b16",
          "accent": "#df9a7f", "accent-content": "#3b1d16",
          "neutral": "#dce8e4", "neutral-content": "#1d2928",
          "base-100": "#202c2b", "base-200": "#172120", "base-300": "#344441", "base-content": "#e5eeea",
          "info": "#78b6e0", "success": "#68bd93", "warning": "#e7b45d", "error": "#e68177",
          "--rounded-box": "1.25rem", "--rounded-btn": "0.75rem", "--rounded-badge": "1rem"
        }
      }
    ],
    darkTheme: "study-dark"
  }
};
