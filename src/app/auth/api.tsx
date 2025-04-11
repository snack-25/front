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
  return { status: res.status, data };
}

export async function loginApi(body: { email: string; password: string }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await res.json();
    // 상태 코드가 200~299가 아니면, 에러 메시지를 반환
    if (!res.ok) {
      return { status: res.status, message: data.message || '로그인 실패' };
    }

    return { status: res.status, data };
  } catch (error) {
    console.error('로그인 요청 실패:', error);
    return { status: 500, message: '서버 오류 발생' };
  }
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

    if (!res.ok) {
      // ✅ 401, 403 등 HTTP 에러 상태면 강제로 throw
      throw {
        status: res.status,
        response: {
          data,
        },
      };
    }

    return { status: res.status, data };
  } catch (error) {
    console.error('초대 코드 정보 요청 에러:', error);
    throw error; // ❗ 이걸 던져야 호출한 곳의 .catch()에서 잡힘
  }
}

export async function invitationSignupApi(params: {
  token: string;
  password: string;
}) {
  const { password, token } = params;
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
    return { status: res.status, data };
  } catch (error) {
    return { status: 500, message: '서버 오류 발생' };
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
    if (!res.ok) {
      throw new Error(data.message || '예산 변경 실패');
    }

    return data;
  } catch (err) {
    console.error('에러 객체', err);
    throw err;
  }
}

export async function updatePasswordApi(body: {
  company?: string;
  password?: string;
}) {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + '/users/update/info',
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
