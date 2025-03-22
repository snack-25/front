import { fetchApi } from '../instance';
import { useSearchParams } from 'next/navigation';

interface SignProps {
  name: string;
  email: string;
  password: string;
  validatePassword?: string;
  company: string;
}

interface loginProps {
  email: string;
  password: string;
}

export async function signupApi(body: SignProps) {
  // 여기에서 body를 문자열로 변환 (JSON.stringify)해서 보내야 함
  return await fetchApi('/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body), // 객체를 문자열로 변환해서 보내야 합니다.
  });
}

export async function loginApi(body: loginProps) {
  return await fetchApi('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function logoutApi() {
  return await fetchApi('/auth/logout', {
    method: 'POST',
    credentials: 'include',
    // refreshToken이 필요한 경우, 예: body에 담거나 헤더에 포함
    body: JSON.stringify({}),
  });
}
export async function invitationSignupApi(params: {
  token: string;
}): Promise<any> {
  try {
    // token을 URL 쿼리 파라미터에 포함하여 요청 (혹은 body에 함께 보내도 됨)
    const res = await fetch(`/api/auth/signup/getinfo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (error) {
    console.error('회원가입 요청 에러:', error);
    return { msg: '회원가입 요청 중 오류가 발생했습니다.' };
  }
}
