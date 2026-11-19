const helvetica = ['"Helvetica Neue ME"', 'Helvetica', 'Arial', 'sans-serif'];

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: { cream: '#efeee9' },
      fontFamily: { hn: helvetica, sans: helvetica, serif: helvetica },
    },
  },
  plugins: [],
};
