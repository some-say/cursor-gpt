require("@rushstack/eslint-config/patch/modern-module-resolution")
module.exports = {
  extends: [
    "@rushstack/eslint-config/profile/node",
    "@rushstack/eslint-config/mixins/friendly-locals",
    "@nodesuite/eslint-config"
  ],
  overrides: [
    {
      files: ["src/**/*.ts"],
      rules: {
        "@rushstack/no-new-null": "off",
        "@typescript-eslint/no-unused-vars": ["error", {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "ignoreRestSiblings": true
        }],
      }
    },
    {
      files: ["src/plugins/*.ts"],
      rules: {
        "lines-around-comment": "off"
      }
    },
  ]
}
