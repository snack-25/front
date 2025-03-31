import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value; // 쿠키에서 accessToken 가져오기
  console.log(token);
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth/login');

  // 1️⃣ 로그인 페이지 접근 시, 이미 로그인한 유저는 홈으로 리디렉트
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 2️⃣ 보호된 페이지 접근 시, 로그인하지 않았으면 로그인 페이지로 리디렉트
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route),
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next(); // 정상적으로 요청 진행
}

// 미들웨어가 실행될 경로 지정
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/login',
  ],
};
