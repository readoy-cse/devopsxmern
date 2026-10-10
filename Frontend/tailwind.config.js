/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        "study-light": {
          "primary": "#167c75", "primary-content": "#ffffff",
          "secondary": "#e7a841", "secondary-content": "#2c2418",
          "accent": "#df795e", "accent-content": "#ffffff",
          "neutral": "#243433", "neutral-content": "#f7f7f2",
          "base-100": "#ffffff", "base-200": "#f4f5ef", "base-300": "#e5e8df", "base-content": "#243433",
          "info": "#3978a8", "success": "#39876b", "warning": "#d3912c", "error": "#c9554d",
          "--rounded-box": "1.25rem", "--rounded-btn": "0.75rem", "--rounded-badge": "1rem"
        }
      },
      {
        "study-dark": {
          "primary": "#65c3b5", "primary-content": "#123c38",
          "secondary": "#f0bd69", "secondary-content": "#382b16",
          "accent": "#f09277", "accent-content": "#3b1d16",
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
