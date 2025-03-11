import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/gnb/Header';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: '스낵25',
  description: '스낵25는 100만 직장인들의 간식을 책임지는 B2B 플랫폼입니다.',
};

/**
 * 애플리케이션의 루트 레이아웃을 구성하는 컴포넌트입니다.
 *
 * 이 컴포넌트는 HTML의 lang 속성을 'ko'로 설정하고, 로컬 폰트와 추가 CSS 클래스(안티앨리어싱 및 배경 스타일)를 적용한
 * <body> 요소 내에 Header 컴포넌트와 전달받은 하위 컴포넌트(children)를 렌더링합니다.
 *
 * @param children - 레이아웃 내에 표시할 자식 요소들.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body className={`${pretendard.variable} antialiased bg-background-400`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
