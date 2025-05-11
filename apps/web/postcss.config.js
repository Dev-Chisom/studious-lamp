module.exports = {
  plugins: {
    tailwindcss: {}, // This is still needed
    autoprefixer: {},
    '@tailwindcss/postcss': {}, // This is the new plugin you need to add
  },
}
