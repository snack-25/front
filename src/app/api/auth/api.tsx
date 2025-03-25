import { fetchApi } from '../instance';

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
    body: JSON.stringify(body), // 객체를 문자열로 변환해서 보내야 합니다.
  });
}

export async function loginApi(body: loginProps) {
  return await fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function logoutApi() {
  return await fetchApi('/auth/logout', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({}),
  });
}

export async function invitationCodeApi(params: {
  token: string;
}): Promise<any> {
  try {
    console.log('params', params);

    const res = await fetchApi('/auth/signup/invitationcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    // token을 URL 쿼리 파라미터에 포함하여 요청 (혹은 body에 함께 보내도 됨)
    return await res;
  } catch (error) {
    console.error('초대 코드 정보 요청 에러:', error);
    return { msg: '초대 코드 정보 요청 오류가 발생했습니다.', error };
  }
}

export async function invitationSignupApi(params: {
  token: string;
  password: string;
}) {
  const { password, token } = params;
  try {
    const res = await fetchApi(`/auth/signup/invite/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    return await res;
  } catch (error) {
    return { msg: '회원가입에 실패했습니다', error };
  }
}
