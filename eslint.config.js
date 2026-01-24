import antfu from '@antfu/eslint-config';

import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tailwindcss from 'eslint-plugin-tailwindcss';

const config = antfu(
    {
        type: 'app',
        isInEditor: true,
        react: true,
        typescript: {
            overrides: {
                'ts/consistent-type-definitions': 0,
            },
        },
        yaml: true,
        markdown: true,
        formatters: true,
        vue: false,

        stylistic: {
            indent: 4,
            semi: true,

            overrides: {
                'style/brace-style': [
                    2,
                    '1tbs',
                    {
                        allowSingleLine: true,
                    },
                ],
                'style/arrow-parens': [2, 'always'],
                'style/multiline-ternary': [2, 'always-multiline', { ignoreJSX: true }],
            },
        },
        ignores: ['**/ueditor-plus/', '**/backend-server/**/*.java', '**/backend-server/**/mapper/*.xml'],
    },
    {
        files: ['**/*.{yml,yaml}'],
        rules: {
            'style/no-multi-spaces': 0,
            'yml/indent': ['error', 4, { indentBlockSequences: true, indicatorValueIndent: 4 }],
        },
    },
    {
        languageOptions: {
            globals: {
                chrome: 'readonly',
            },
        },
        plugins: {
            tailwindcss,
        },
        settings: {
            tailwindcss: {
                callees: ['classnames', 'clsx'],
            },
        },
        rules: {
            'tailwindcss/classnames-order': 'warn',
            'tailwindcss/enforces-negative-arbitrary-values': 'warn',
            'tailwindcss/enforces-shorthand': 'warn',
            'tailwindcss/migration-from-tailwind-2': 'off',
            'tailwindcss/no-arbitrary-value': 'off',
            'tailwindcss/no-custom-classname': 'off',
            'tailwindcss/no-contradicting-classname': 'off',
            'tailwindcss/no-unnecessary-arbitrary-value': 'warn',
        },
    },
    {
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'no-console': 0,
            'no-unused-vars': 0,

            'node/prefer-global/process': 0,

            'unicorn/consistent-function-scoping': 0,
            'react-refresh/only-export-components': 0,

            'import/order': 0,
            'sort-imports': 0,
            'perfectionist/sort-imports': 0,
            'perfectionist/sort-named-imports': 0,
            'perfectionist/sort-named-export': 0,
            'perfectionist/sort-named-exports': 0,

            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        ['^node:'],
                        ['^electron', '^@electron'],
                        ['^react'],
                        ['^@?antd?(.*)$'],
                        ['^[@~]?\\w'],
                        ['^\\u0000'],
                        ['^@someok(.*)$'],
                        ['^@/(.*)$'],
                        ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                        ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                        ['^.+\\.(css|less|sass|scss)$'],
                    ],
                },
            ],
            'simple-import-sort/exports': 'error',

            'jsdoc/require-returns-description': 0,
        },
    },
);

export default config;
