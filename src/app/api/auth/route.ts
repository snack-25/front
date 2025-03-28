import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify, JsonWebTokenError } from 'jsonwebtoken';
import ValidatedEnvVars from '@/config/env';

enum TokenType {
  accessToken = 'accessToken',
  refreshToken = 'refreshToken',
}

interface TokenPayload {
  sub: string;
  exp: number;
}

const clearCookie = async (token: TokenType) => {
  const cookieStore = await cookies();
  cookieStore.delete(token);
};

export async function GET() {
  try {
    const cookieStore = await cookies();

    // 쿠키에서 accessToken 또는 refreshToken을 가져옵니다
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // 토큰이 없으면 401 에러를 반환
    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    // verify()는 토큰이 유효하지 않으면 에러를 던집니다
    const decodedAccessToken = verify(
      accessToken,
      ValidatedEnvVars.JWT_SECRET,
    ) as TokenPayload;
    const decodedRefreshToken = verify(
      refreshToken,
      ValidatedEnvVars.JWT_REFRESH_SECRET,
    ) as TokenPayload;

    if (decodedAccessToken.sub !== decodedRefreshToken.sub) {
      return NextResponse.json(
        { error: '토큰 사용자가 일치하지 않습니다.' },
        { status: 401 },
      );
    }

    const now = Math.floor(Date.now() / 1000);

    // 토큰 만료 시간 검증
    if (decodedAccessToken.exp < now || decodedRefreshToken.exp < now) {
      return NextResponse.json(
        { error: '만료된 토큰입니다.' },
        { status: 401 },
      );
    }

    // decodedAccessToken 또는 decodedRefreshToken의 sub 속성을 userId 이름으로 반환
    return NextResponse.json({
      userId: decodedAccessToken.sub ?? decodedRefreshToken.sub,
    });
  } catch (error) {
    // 에러 종류별로 다른 응답
    if (error instanceof JsonWebTokenError) {
      // 토큰이 유효하지 않은 경우 쿠키에서 토큰 삭제
      clearCookie(TokenType.accessToken);
      clearCookie(TokenType.refreshToken);
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 },
      );
    }
    // 서버 에러는 자세한 내용을 클라이언트에 노출하지 않음
    console.error('인증 에러:', error);
    return NextResponse.json(
      { error: '인증에 실패했습니다.' },
      { status: 500 },
    );
  }
}
