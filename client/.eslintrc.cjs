module.exports = {
root: true,
env: { browser: true, es2020: true },
extends: [
'eslint:recommended',
'plugin:@typescript-eslint/recommended',
'plugin:react-hooks/recommended',
"plugin:react/recommended",
],
settings: {
"react": {
"version": "detect",}
},
ignorePatterns: ['dist', '.eslintrc.cjs', '/src/components/ui/**/*', '/src/components/services/theme-provider.tsx'],
parser: '@typescript-eslint/parser',
plugins: ['react-refresh'],
rules: {
"react/no-array-index-key": "error",
"react/react-in-jsx-scope": "off",
'react-refresh/only-export-components': [
'warn',
{
  allowConstantExport: true },
  ],
  },
}
