/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard', // CSS 표준 규칙 세트
    // 'stylelint-config-standard-scss', // CSS 표준 규칙 SCSS 지원(사용안함)
    '@stylistic/stylelint-config', // 코드 포맷팅 규칙
    'stylelint-config-recess-order', // CSS 속성 순서 규칙
    'stylelint-config-clean-order', // 최종 CSS 속성 정리(그룹마다 빈 줄 추가) 규칙
    // stylelint-config-prettier는 중복 설정을 제외하여 Stylelint 15 이후로 불필요
  ],
  plugins: [
    'stylelint-order', // CSS 속성 순서
    // 'stylelint-a11y', // 접근성 규칙(호환성 문제로 사용안함)
  ],
  rules: {
    // @import 사용 허용
    'import-notation': null,
    // TailwindCSS의 특수 지시자(@apply, @tailwind 등) 허용
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          /* TailwindCSS v4 */
          'theme',
          'source',
          'utility',
          'variant',
          'custom-variant',
          'plugin',
          /* TailwindCSS v3 */
          'tailwind',
          'apply',
          'layer',
          'config',
          /* TailwindCSS v1, v2 */
          'variants',
          'responsive',
          'screen',
        ],
      },
    ],
    // TailwindCSS의 theme() 함수 허용
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme'],
      },
    ],
    // @apply 규칙 사용 허용 (deprecated 경고 비활성화)
    'at-rule-no-deprecated': null,
  },
};
