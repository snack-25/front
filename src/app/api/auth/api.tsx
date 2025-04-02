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
  console.log('12321');
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

export async function getBudgetApi(body: { companyId: string }) {
  try {
    const res = await fetchApi('/budgets/inquiry', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return res;
  } catch (error) {
    return { msg: '예산 조회에 실패하였습니다' };
  }
}

export async function updateBudgetApi(body: {}) {
  try {
    const res = await fetchApi('/budgets/update', {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return res;
  } catch (err) {
    return { msg: '예산 변경이 실패하였습니다' };
  }
}
