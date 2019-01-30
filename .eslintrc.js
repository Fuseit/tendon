module.exports = {
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:prettier/recommended'
  ],
  env: {
    node: true,
    browser: true
  },
  rules: {
    'prettier/prettier': 'error',
    'no-underscore-dangle': 'off'
  }
};
