import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import tsParser from "@typescript-eslint/parser";
import eslintPluginTS from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "vite.config.*",
      "tailwind.config.*",
      "prettier.config.*",
      "eslint.config.*",
    ],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },

    plugins: {
      react: eslintPluginReact,
      "react-hooks": eslintPluginReactHooks,
      prettier: eslintPluginPrettier,
      "react-refresh": eslintPluginReactRefresh,
      "@typescript-eslint": eslintPluginTS,
    },

    rules: {
      // react-refresh
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // TypeScript
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],

      // Prettier
      "prettier/prettier": [
        "warn",
        {
          semi: true,
          singleQuote: false,
          usePrettierrc: true,
        },
      ],

      // JS rules
      "no-nested-ternary": "error",
      "no-restricted-exports": [
        "error",
        { restrictedNamedExports: ["default", "then"] },
      ],
      "no-restricted-globals": [
        "error",
        {
          name: "isFinite",
          message:
            "Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite",
        },
        {
          name: "isNaN",
          message:
            "Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan",
        },
      ],

      "no-restricted-syntax": [
        "error",
        {
          selector: "ForInStatement",
          message:
            "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
        },
        {
          selector: "ForOfStatement",
          message:
            "iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Loops should be avoided in favor of array iterations.",
        },
        {
          selector: "LabeledStatement",
          message:
            "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
        },
        {
          selector: "WithStatement",
          message:
            "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
        },
      ],

      "no-return-assign": ["error", "always"],
      "no-unneeded-ternary": ["error", { defaultAssignment: false }],
      "no-unused-vars": "off",
      "no-useless-rename": [
        "error",
        {
          ignoreDestructuring: false,
          ignoreImport: false,
          ignoreExport: false,
        },
      ],

      // React
      "react/display-name": "off",
      "react/prop-types": "off",

      // Console
      "no-console": [
        "warn",
        {
          allow: [
            "warn",
            "error",
            "info",
            "debug",
            "group",
            "groupEnd",
            "time",
            "timeEnd",
            "assert",
          ],
        },
      ],
    },
  },
];
