import { fetchApi } from '../instance';

interface SignProps {
  name: string;
  email: string;
  password: string;
  validatePassword?: string;
  company: string;
  bizno: string;
}

interface loginProps {
  email: string;
  password: string;
}

interface budgetProps {
  companyId: string;
  thisMonth: number;
  everyMonth: number;
}

export async function signupApi(body: SignProps) {
  console.log('body');
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
    const res = await fetchApi('/auth/signup/invitationcode', {
      method: 'POST',
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
  console.log('params', params);
  console.log('token', token);
  try {
    const res = await fetchApi(`/auth/signup/invite/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    return await res;
  } catch (error) {
    return { msg: '회원가입에 실패했습니다', error };
  }
}

export async function budgetApi(body: { companyId: string }) {
  try {
    const res = await fetchApi('/budgets/inquiry', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return res;
  } catch (error) {
    return { msg: '예산 변경이 실패하였습니다' };
  }
}

// type ExtendedRequestInit = Omit<RequestInit, 'body'> & {
//   body?: any; // 객체 형태로 body를 받을 수 있도록 허용합니다.
// };

// async function authApi(
//   endpoint: string,
//   options: ExtendedRequestInit = {},
// ): Promise<any> {
//   const response = await fetch(`${API_BASE_URL}/api/auth${endpoint}`, {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     },
//     credentials: 'include',
//     body:
//       options.method === 'GET' ? undefined : JSON.stringify(options.body ?? {}),
//   });

//   // 응답 본문이 없을 경우를 처리
//   const text = await response.text();
//   let data;
//   try {
//     data = text ? JSON.parse(text) : {};
//   } catch (error) {
//     console.error('JSON 파싱 오류:', error);
//     throw new Error('응답을 JSON으로 파싱하는데 실패했습니다.');
//   }
//   if (!response.ok) {
//     console.log(data);
//     throw new Error(data.message || 'API 요청 실패');
//   }
//   return data;
// }
