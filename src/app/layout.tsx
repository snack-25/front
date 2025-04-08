import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';

import Header from '@/components/gnb/Header';

import './globals.css';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body
        className={`${pretendard.variable} antialiased bg-background-400 w-full`}
      >
        <Header />
        {children}
        <Toaster
          position='top-center'
          closeButton
        />
      </body>
    </html>
  );
}
