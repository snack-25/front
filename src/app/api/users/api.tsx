// src/app/api/users/api.ts

import { fetchApi } from '../instance';

interface InviteUserParams {
  name: string;
  email: string;
  role: string;
}

// 회원 초대 API 호출 함수
export async function inviteUserApi(data: InviteUserParams) {
  return await fetchApi('/invitations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
