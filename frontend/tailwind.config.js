import { transform } from "@babel/core";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'popup-slide-up': 'popupSlideUp 0.5s ease-in-out',
        'popup-slide-down': 'popupSlideDown 0.5s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        popupSlideUp: {
          '0%': { transform: 'translateY(100%) translateX(-50%)' },
          '100%': { transform: 'translateY(0%) translateX(-50%)' },
        },
        popupSlideDown: {
          '0%': { transform: 'translateY(0%) translateX(-50%)' },
          '100%': { transform: 'translateY(100%) translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },

    },

  },
  plugins: [],
}