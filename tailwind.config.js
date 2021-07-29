module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        wordpress: '#3858e9'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
