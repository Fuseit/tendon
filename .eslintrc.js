module.exports = {
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  env: {
    node: true,
    browser: true,
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
