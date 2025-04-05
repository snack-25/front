import { FlatCompat } from '@eslint/eslintrc';
// import eslintJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import security from 'eslint-plugin-security';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sonarjs from 'eslint-plugin-sonarjs';
import unusedImports from 'eslint-plugin-unused-imports';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
//FIXME: ESLint v9 미지원으로 미사용 import typescriptSortKeys from 'eslint-plugin-typescript-sort-keys';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 무시할 디렉터리 설정
  {
    ignores: ['node_modules/', 'dist/', '.next/'],
  },

  // ESLint 기본 권장 설정(일부 PC 오류로 미사용)
  // eslintJs.configs.recommended,
  // Next.js + Core Web Vitals + Typescript 관련 설정
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // TypeScript + React + Next.js 관련 설정
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      security: security,
      sonarjs: sonarjs,
      //FIXME: ESLint v9 미지원으로 미사용 'typescript-sort-keys': typescriptSortKeys,
    },
    rules: {
      // ✅ Import 정렬 및 사용하지 않는 import 제거
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // `react` first, `next` second, then packages starting with a character
            ['^react$', '^next', '^[a-z]'],
            // Packages starting with `@`
            ['^@'],
            // Packages starting with `~`
            ['^~'],
            // Imports starting with `../`
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Imports starting with `./`
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports
            ['^.+\\.s?css$'],
            // Side effect imports
            ['^\\u0000'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // ✅ React 규칙
      // 'react/prop-types': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': 'error',

      // ✅ React Hooks 규칙
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ✅ 접근성 규칙
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',

      // ✅ Next.js 규칙
      // 'next/no-img-element': 'warn',
      // 'next/no-html-link-for-pages': 'warn',

      // ✅ Import 규칙 (정렬 포함)
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/prefer-default-export': 'off',
      'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
          ],
          //
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // ✅ TypeScript 규칙
      '@typescript-eslint/no-unused-vars': ['off'],
      // '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      //FIXME: ESLint v9 미지원으로 미사용 'typescript-sort-keys/interface': 'warn',
      //FIXME: ESLint v9 미지원으로 미사용 'typescript-sort-keys/string-enum': 'warn',

      // ✅ 보안 및 코드 품질 향상
      'security/detect-object-injection': 'off',
      'sonarjs/cognitive-complexity': ['warn', 15],

      // ✅ 일반적인 규칙
      'no-console': ['off', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off', // TypeScript 버전을 대신 사용
      'prefer-const': 'error',
      eqeqeq: 'error',
      curly: 'warn',
    },
  },

  // 특정 파일 패턴에 대한 규칙 오버라이드 (테스트 파일)
  {
    files: ['**/*.test.{js,ts,jsx,tsx}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // ESM 모듈 규칙
  {
    files: ['**/*.mjs'],
    rules: {
      'import/extensions': ['error', 'always'],
    },
  },
];

export default eslintConfig;
