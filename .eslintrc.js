module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "node": true
  },
  "extends": "eslint-config-airbnb",
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ],
    "comma-dangle": [
      "error",
      "always-multiline"
    ],
    "comma-style": 0,
    "no-console": 0,
    "one-var": 0,
    "prefer-rest-params": 0,
    "no-underscore-dangle": 0,
    "prefer-arrow-callback": 0,
    "space-before-function-paren": 0,
    "func-names": 0,
    "no-param-reassign": 0,
    "consistent-return": 0,
    "global-require": 0,
    "no-unused-vars": [2, {"args": "none"}],
  }
}
