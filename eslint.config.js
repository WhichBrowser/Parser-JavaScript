const js = require('@eslint/js');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const globals = require('globals');

/* eslint-config-google (github.com/google/eslint-config-google) is archived and its last
 * release predates flat config; these are the rules it added on top of eslint:recommended
 * that still apply once eslint-plugin-prettier/recommended has turned off every formatting
 * rule, kept here directly so the project doesn't depend on an unmaintained package. */
const codeQualityRules = {
  'guard-for-in': 2,
  'no-caller': 2,
  'no-extend-native': 2,
  'no-extra-bind': 2,
  'no-invalid-this': 2,
  'no-multi-str': 2,
  'no-new-wrappers': 2,
  'no-throw-literal': 2,
  'no-with': 2,
  'prefer-promise-reject-errors': 2,
  'no-unused-vars': [2, { args: 'none' }],
  camelcase: [2, { properties: 'never' }],
  'new-cap': 2,
  'no-array-constructor': 2,
  'no-new-object': 2,
  'one-var': [2, { var: 'never', let: 'never', const: 'never' }],
  'spaced-comment': [2, 'always'],
  'no-new-symbol': 2,
  'no-var': 2,
  'prefer-const': [2, { destructuring: 'all' }],
  'prefer-rest-params': 2,
  'prefer-spread': 2,
};

module.exports = [
  js.configs.recommended,
  {
    rules: codeQualityRules,
  },
  prettierRecommended,
  {
    languageOptions: {
      ecmaVersion: 6,
      sourceType: 'commonjs',
      globals: Object.assign({}, globals.node, globals.es2015),
    },
    rules: {
      'no-control-regex': 0,
      'no-console': 'warn',
      // The codebase's idiom is `let match; if ((match = re.exec(ua))) {...}` repeated many
      // times in the same function to probe a UA string against a sequence of patterns.
      'no-useless-assignment': 0,
    },
  },
];
