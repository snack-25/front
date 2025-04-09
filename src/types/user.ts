// 전체 사용자 리스트 조회 응답 타입
export type PaginatedUserResponse = {
  totalCount: number; // 전체 사용자 수
  users: {
    id: string; // 사용자 ID
    name: string; // 사용자 이름
    email: string; // 이메일 주소
    role: 'admin' | 'basicUser'; // 사용자 역할
  }[];
};
