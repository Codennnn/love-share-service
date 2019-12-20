module.exports = {
  extends: 'eslint-config-egg',
  parser: 'babel-eslint',
  rules: {
    'generator-star-spacing': 'off',
    'babel/generator-star-spacing': 'off',
    'array-bracket-spacing': ["error", "never"],
    semi: ["error", "never"],
  }
}
