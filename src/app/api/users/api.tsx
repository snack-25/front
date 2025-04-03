// src/app/api/users/api.ts

import { fetchApi } from '@/app/api/instance';

interface InviteUserParams {
  name: string;
  email: string;
  role: string;
  companyId: string; // 소속 회사 ID
  inviterId: string; // 초대한 사용자 ID (예: 현재 로그인한 관리자 ID)
}

// 회원 초대 API 호출 함수
export async function inviteUserApi(data: InviteUserParams) {
  return await fetchApi('/invitations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
