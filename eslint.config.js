// eslint.config.mjs
import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';

const typedTs = ts.configs.recommendedTypeChecked.map(c => ({
  ...c,
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    ...(c.languageOptions ?? {}),
    parserOptions: {
      ...(c.languageOptions?.parserOptions ?? {}),
      project: ['./tsconfig.json'],
      tsconfigRootDir: new URL('.', import.meta.url)
    }
  }
}));

export default [
  { ignores: ['node_modules', 'dist', 'eslint.config.*'] },
  { languageOptions: { globals: globals.node } },
  js.configs.recommended,
  ...typedTs
];

