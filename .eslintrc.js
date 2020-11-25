module.exports = {
  extends: [
    "react-app",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "prettier/react",
    "prettier/@typescript-eslint",
  ],
  rules: {
    "jsx-a11y/anchor-is-valid": "off",
    "react/prop-types": "off",
    "react/display-name": "off",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
  },
  plugins: ["react"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};
