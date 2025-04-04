import { fetchApi } from '../api/instance';

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
  currentAmount: number;
  initialAmount: number;
  year: number;
  month: number;
}

export async function signupApi(body: SignProps) {
  // 여기에서 body를 문자열로 변환 (JSON.stringify)해서 보내야 함
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  const data = await res.json();
  return data;
}

export async function loginApi(body: loginProps) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  const data = await res.json();
  return data;
}

export async function logoutApi() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const data = await res.json();
  return data;
}

export async function invitationCodeApi(params: {
  token: string;
}): Promise<any> {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + '/auth/signup/invitationcode',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        credentials: 'include',
      },
    );
    const data = await res.json();
    // token을 URL 쿼리 파라미터에 포함하여 요청 (혹은 body에 함께 보내도 됨)
    return data;
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
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/auth/signup/invite/${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include',
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return { msg: '회원가입에 실패했습니다', error };
  }
}

export async function getBudgetApi(body: { companyId: string }) {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + '/budgets/inquiry',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return { msg: '예산 조회에 실패하였습니다' };
  }
}

export async function updateBudgetApi(body: budgetProps) {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + '/budgets/update',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      },
    );
    const data = await res.json();
    return data;
  } catch (err) {
    return { msg: '예산 변경이 실패하였습니다' };
  }
}

export async function updatePasswordApi(body: {
  company?: string;
  password: string;
}) {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + '/auth/update/info',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      },
    );
    const data = await res.json();
    return data;
  } catch (err) {
    return { msg: '프로필 변경이 실패하였습니다' };
  }
}
