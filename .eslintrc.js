module.exports = {
  extends: ['airbnb-base'],
  rules: {
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'global-require': 'warn',
    camelcase: 'off',
    'func-names': 'off',
  },
  overrides: [
    {
      files: [
        '**/*.spec.js',
        '**/*.test.js',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
