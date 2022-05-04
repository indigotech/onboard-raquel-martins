module.exports = {
  root: true,
  ignorePatterns: [".eslintrc.js"],
  plugins: ["prettier"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  rules: {
    "prettier/prettier": ["error",{
      singleQuote: true,
      trailingComma: "none"
    }],
    "camelcase": [2, {"properties": "always"}]
  }
};
