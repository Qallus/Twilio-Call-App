module.exports = {
  content: [
    './public/**/*.html',
    './public/**/*.js',
    './index.html', // if index.html is in the root directory
  ],
  theme: {
    extend: {
      colors: {
        stripeIndigo: '#6772E5', // Stripe's indigo color
        neonRed: '#ff073a', // A bright electric red color
      },
    },
  },
  plugins: [],
};

