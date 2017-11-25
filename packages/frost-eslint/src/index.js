module.exports = {
    parser: 'babel-eslint',
    parserOptions: {
        ecmaFeatures: {
            generators: true,
            experimentalObjectRestSpread: true
        },
        sourceType: 'module',
        allowImportExportEverywhere: false
    },
    extends: ['airbnb'],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.json', '.css']
            }
        }
    },
    globals: {
        window: true,
        document: true,
        __dirname: true,
        process: true,
        test: true,
        fetch: true
    },
    rules: {
        'import/extensions': [
            'error',
            'always',
            {
                js: 'never',
                jsx: 'never'
            }
        ],
        'no-shadow': 0,
        'no-use-before-define': 0,
        'no-param-reassign': 0,
        'no-confusing-arrow': 0,
        'no-underscore-dnage': 0,
        'no-plusplus': 0,
        'prefer-template': 1,
        'global-require': 1,
        'import/no-named-default': 1,
        'no-console': 1,
        'consistent-return': 0,
        'import/prefer-default-export': 1
    }
}
