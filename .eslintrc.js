module.exports = {
    'parser': 'babel-eslint',
    'extends': 'airbnb',
    'rules': {
        'array-callback-return': ['off'],
        'arrow-body-style': ['off'],
        'arrow-parens': ['off'],
        'camelcase': ['off'],
        'comma-dangle': ['off'],
        'comma-spacing': ['error', { 'before': false, 'after': true }],
        'consistent-return': ['off'],
        'default-case': 'off',
        'dot-notation': 'off',
        'eol-last': ['off'],
        'eqeqeq': 'off',
        'func-names': ['off'],
        'guard-for-in': 'off',
        'global-require': ['off'],
        'import/prefer-default-export': ['off'],
        'import/no-extraneous-dependencies': 'off',
        'class-methods-use-this': ['off'],
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'import/first': 'off',
        'import/no-cycle': 'off',
        'import/order': 'off',
        'jsx-a11y/anchor-has-content': ['off'],
        'jsx-a11y/click-events-have-key-events': ['off'],
        'jsx-a11y/control-has-associated-label': 'off',
        'jsx-a11y/img-has-alt': ['off'],
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-quotes': ['error', 'prefer-single'],
        'keyword-spacing': ['error', { 'after': true }],
        'lines-between-class-members': 'off',
        'linebreak-style': 'off',
        'max-len': 'off',
        'new-cap': 'off',
        'no-bitwise': 'off',
        'no-console': 'off',
        'no-class-assign': 'off',
        'no-constant-condition': 'off',
        'no-case-declarations': 'off',
        'no-else-return': 'off',
        'no-floating-decimal': 'off',
        'no-multi-assign': 'off',
        'no-mixed-operators': 'off',
        'no-nested-ternary': 'off',
        'no-path-concat': 'off',
        'no-param-reassign': 'off',
        'no-plusplus': 'off',
        'no-restricted-globals': 'off',
        'no-restricted-syntax': 'off',
        'no-return-assign': 'off',
        'no-self-compare': 'off',
        'no-shadow': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'no-unreachable': 'off',
        'no-unneeded-ternary': 'off',
        'no-useless-escape': 'off',
        'no-use-before-define': 'off',
        'no-useless-constructor': 'off',
        'no-throw-literal': 'off',
        'no-trailing-spaces': 'off',
        'no-var': ['off'],
        'object-shorthand': 'off',
        'object-curly-newline': 'off',
        'operator-linebreak': 'off',
        'padded-blocks': 'off',
        'prefer-arrow-callback': 'off',
        'prefer-template': 'off',
        'prefer-const': 'off',
        'prefer-destructuring': 'off',
        'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
        'quote-props': 'off',
        'react/forbid-prop-types': ['off'],
        'react/destructuring-assignment': ['off'],
        'react/jsx-curly-brace-presence': ['off'],
        'react/jsx-curly-newline': ['off'],
        'react/jsx-filename-extension': ['off'],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-props-no-spreading': ['off'],
        'react/jsx-space-before-closing': ['off'],
        'react/jsx-tag-spacing': ['off'],
        'react/jsx-wrap-multilines': ['off'],
        'react/no-access-state-in-setstate': ['off'],
        'react/no-array-index-key': ['off'],
        'react/no-danger': ['off'],
        'react/no-did-update-set-state': ['off'],
        'react/no-unescaped-entities': ['off'],
        'react/no-did-mount-set-state': ['off'],
        'react/prop-types': 'off',
        'react/prefer-stateless-function': 'off',
        'react/self-closing-comp': ['off'],
        'react/state-in-constructor': ['off'],
        'semi': 'off',
        'space-before-function-paren': ['off'],
        'spaced-comment': ['off'],
        'space-in-parens': ['off'],
        'vars-on-top': ['off'],
        'wrap-iife': ['off'],
    },
    'overrides': [{
        'files': ['./src/tests/e2e/*.js'],
        'rules': {
            'no-unused-expressions': 'off'
        }
    }]
}
