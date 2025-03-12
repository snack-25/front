import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: 'var(--font-pretendard)',
      },
      colors: {
        background: {
          DEFAULT: 'var(--background)',
          100: 'var(--color-background-100)',
          200: 'var(--color-background-200)',
          300: 'var(--color-background-300)',
          400: 'var(--color-background-400)',
          500: 'var(--color-background-500)', // 기존 #FDF0DF 대체
        },
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--color-primary-400)', // 기존 #F97B22 대체
          hover: '#E06B1F', // hover 시 색상
          active: '#C95D1A', // active 상태
        },
        border: {
          DEFAULT: 'var(--color-primary-300)', // 기존 #FCC49C 대체
        },
        text: {
          dark: 'var(--color-black-400)', // 기존 #1F1F1F 대체
          white: '#FFFFFF', // 흰색 텍스트
        },
      },
      borderRadius: {
        xl: '16px',
        '3xl': '32px',
      },
    },
  },
  plugins: [],
} satisfies Config;
