const jselint = require("@eslint/js")
const tselint = require("typescript-eslint")
const { defineConfig } = require('eslint/config')

module.exports = defineConfig([

    {
        ignores: [
            'eslint.config.cjs',
            '**/.yarn/**',
            '**/.pnp.**',
            '**/playwright-report/**'
        ]
    },
    {
        files: ["**/*.{js,ts}"],
        ...jselint.configs.recommended,
    },

    ...tselint.configs.recommended
])