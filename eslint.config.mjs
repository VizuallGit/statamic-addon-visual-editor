/**
 * ESLint for the quality pass. Existing findings are frozen in
 * eslint-suppressions.json (ESLint's bulk suppressions), so only new code has
 * to pass the rules marked 'error'. Warnings are the debt list for phase 4 and
 * never fail a run.
 *
 *   npx eslint .                      what new code must pass
 *   npx eslint . --prune-suppressions after a clean-up: freeze the lower count
 */
import js from '@eslint/js';
import globals from 'globals';
import vue from 'eslint-plugin-vue';
import unicorn from 'eslint-plugin-unicorn';
import sonarjs from 'eslint-plugin-sonarjs';

const errors = {
  'no-undef': 'error',
  'no-unused-vars': ['error', { args: 'after-used', caughtErrors: 'none', ignoreRestSiblings: true }],
  'no-unreachable': 'error',
  'no-dupe-keys': 'error',
  'no-dupe-else-if': 'error',
  'no-self-assign': 'error',
  // A catch must do something: a comment alone does not count (that is what hides "it sometimes fails").
  'no-empty': ['error', { allowEmptyCatch: false }],
  'no-var': 'error',
  'prefer-const': ['error', { destructuring: 'all' }],
  'max-depth': ['error', 5],
  'sonarjs/no-identical-functions': 'error',
  'sonarjs/no-all-duplicated-branches': 'error',
};

const warnings = {
  eqeqeq: ['warn', 'smart'],
  'no-lonely-if': 'warn',
  'sonarjs/cognitive-complexity': ['warn', 25],
  'sonarjs/no-collapsible-if': 'warn',
  'unicorn/no-for-loop': 'warn',
  'unicorn/prefer-includes': 'warn',
  'unicorn/prefer-array-some': 'warn',
  'unicorn/prefer-string-replace-all': 'warn',
  'unicorn/prefer-node-protocol': 'warn',
  'unicorn/prefer-optional-catch-binding': 'warn',
  'unicorn/no-useless-spread': 'warn',
  'unicorn/no-lonely-if': 'warn',
};

export default [
  // Only the addon's own source: local restore points (.restore/) and scratch
  // folders hold old bundles of a megabyte and more.
  {
    ignores: [
      '**/*',
      '!resources/',
      '!resources/js/**',
      '!scripts/**',
      '!tests/**',
      '!*.{js,mjs}',
      'scripts/bundled/**',
      'tests/__fixtures__/**',
    ],
  },
  js.configs.recommended,
  ...vue.configs['flat/essential'],
  {
    plugins: { unicorn, sonarjs },
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: { ...errors, ...warnings },
  },
  {
    // `Statamic` is the CP's own global (window.Statamic).
    files: ['resources/js/**/*.{js,mjs,vue}'],
    languageOptions: { globals: { ...globals.browser, Statamic: 'readonly' } },
  },
  {
    // Node scripts and tests; the browser tests also run code inside the page.
    files: ['scripts/**/*.{js,mjs}', 'tests/**/*.{js,mjs}', '*.{js,mjs}'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['tests/browser/**/*.{js,mjs}', 'tests/harness/**/*.{js,mjs}', 'tests/e2e/**/*.{js,mjs}'],
    languageOptions: { globals: { ...globals.node, ...globals.browser, Statamic: 'readonly' } },
  },
];
