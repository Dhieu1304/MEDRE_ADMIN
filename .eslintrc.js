module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "airbnb", "plugin:prettier/recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["react"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "no-restricted-exports": "off",
    "import/prefer-default-export": "off",
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "react/forbid-prop-types": [
      "error",
      {
        forbid: ["any"],
        checkContextTypes: true,
        checkChildContextTypes: true,
        checkPropTypes: true,
        skipShapeProps: true
      }
    ],
    "react/jsx-props-no-spreading": "off"
  }
};
