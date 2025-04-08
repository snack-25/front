// src/app/api/users/api.ts

import { fetchApi } from '@/app/api/instance';
import { PaginatedUserResponse } from '@/types/user';

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

// 회원 목록 조회 API 호출 함수
export async function getUserListApi({
  page = 1,
  limit = 10,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedUserResponse> {
  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    queryParams.append('search', search);
  }

  const url = `/users?${queryParams.toString()}`;

  try {
    const response = await fetchApi(url, { method: 'GET' });

    return response as PaginatedUserResponse;
  } catch (error) {
    console.error('❌ 회원 목록 조회 실패:', error);
    throw new Error('회원 목록 조회 실패');
  }
}
// ✅ 유저 권한 업데이트 API
export async function updateUserRoleApi({
  userId,
  role,
}: {
  userId: string;
  role: string;
}) {
  return await fetchApi(`/users/${userId}/role`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
}
// ✅ 유저 삭제 API
export async function deleteUserApi(userId: string) {
  return await fetchApi(`/users/${userId}`, {
    method: 'DELETE',
  });
}
