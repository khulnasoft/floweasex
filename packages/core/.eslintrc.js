const sharedOptions = require('@flowease_io/eslint-config/shared');

/**
 * @type {import('@types/eslint').ESLint.ConfigData}
 */
module.exports = {
	extends: ['@flowease_io/eslint-config/node'],

	...sharedOptions(__dirname),

	parserOptions: {
		project: './tsconfig.json',
	},

	ignorePatterns: ['bin/*.js'],

	rules: {
		complexity: 'error',

		// TODO: Remove this
		'import/order': 'off',
		'@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': true }],
	},
};
