module.exports = {
    plugins: [
        'eslint-comments',
        'jest',
        'promise',
    ],
    parser: "babel-eslint",
    parserOptions: {
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    extends: [
        'plugin:eslint-comments/recommended',
        'plugin:jest/recommended',
        'plugin:promise/recommended',
        'prettier',
        'prettier/react',
    ],
    env: {
        node: true,
        browser: true,
        jest: true,
        es6: true,
    },
    rules: {
        // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
        'no-prototype-builtins': 'off',
        // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'off',
        // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
        'react/destructuring-assignment': 'off',
        // Use function hoisting to improve code readability
        'no-use-before-define': [
            'error',
            {functions: false, classes: true, variables: true},
        ],
        'no-implied-eval': "off",
    },
}
