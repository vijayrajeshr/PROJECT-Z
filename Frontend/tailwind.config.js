// ------------------------
// tailwind.config.js
// ------------------------
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary-green-500': '#02757A',
        'primary-green-400': '#359195', 
        'primary-soft' : '#BCD9DC',
        'success-rating' : '#BCD9DC',
        'secondary': '#E0E7FF', // Light Indigo
        'accent': {
          DEFAULT: '#FF7A00', // Vibrant Orange
          'hover': '#D96800', // Darker orange for hover
        },
        'background': {
          DEFAULT: '#E6F1F2', // Very Light Gray (almost white)
          'alt': '#F3F4F6',    // Slightly darker gray for containers
        },
        'text': {
          DEFAULT: '#222222', // Darkest Gray (for headings, primary text)
          'muted': '#6B7280',  // Lighter gray (for subtitles, paragraphs)
        },
        'border-color': '#D1D5DB', 
      },
      screens: {
        'nav-break': '578px',
        'desktop': '1050px',
      },
    },
  },
  plugins: [],
};


