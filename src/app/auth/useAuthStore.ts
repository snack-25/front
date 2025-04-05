import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 로컬스토리지 사용할 시

import { initFormType } from '@/app/auth/login/page';

import { loginApi, logoutApi } from './api';

// 백엔드에서 보내는거
// user {
//   email: 'test1111@naver.com',
//   name: '찐찐막',
//   role: 'SUPERADMIN',
//   company: { name: '찐찐막', id: 'ywkvll8eg16s83zcnik2gg1j' },
// }

// JWT 토큰 구조 정의 (백엔드에서 어떤 정보를 주는지에 따라 다름)
interface userInfo {
  id: number;
  email: string;
  name: string;
  companyId: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'USER';
}
interface companyInfo {
  companyName: string;
  companyId: string;
}

// Zustand Store 타입 정의
interface AuthState {
  user: userInfo | null;
  company: companyInfo | null;
  edit: (name: string) => void;
  isAuth: boolean;
  isHydrated: boolean;
  login: (form: initFormType) => Promise<any>;
  logout: () => void;
}

// Zustand Store 생성
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      company: null,
      isAuth: false,
      isHydrated: false,

      // 로그인 (API 호출 후 상태 업데이트 + localStorage 저장)
      login: async (form: initFormType) => {
        try {
          const loginData = await loginApi(form);
          // console.log('🔍 로그인 API 응답:', loginData.data);

          if (loginData.status !== 200) {
            return { status: loginData.status, message: loginData.message };
          }

          if (!loginData.data) {
            throw new Error('로그인 실패: 응답 데이터가 없습니다');
          }

          // loginData.data가 있는 경우에만 구조 분해 할당
          const { id, companyId, companyName, ...res } = loginData.data.data;

          set({
            user: { ...res, id },
            company: { companyId, companyName },
            isAuth: true,
          });

          return loginData;
        } catch (error: any) {
          // 백엔드에서 응답한 오류 메시지가 있으면 그걸 사용
          console.log('error', error);

          if (error.response) {
            console.log('error.response', error.response);
            return {
              status: error.response.status,
              message: error.response.data?.message || '로그인 실패',
            };
          }

          // 백엔드에서 응답이 없을 경우 기본 메시지 반환
          return { status: 500, message: '서버 오류 발생' };
        }
      },

      // 로그아웃 (상태 초기화 + localStorage 삭제)
      logout: async () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('로그아웃 ');
        }
        await logoutApi();
        set({ user: null, company: null, isAuth: false });
      },

      edit: async (companyName: string) => {
        // 필요하다면 서버 API 호출로 정보를 업데이트 할 수 있습니다.
        // 예시: const response = await editCompanyApi({ companyName });

        set((state) => ({
          company: state.company
            ? { ...state.company, companyName }
            : { companyName, companyId: '' },
        }));
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('hydrate error:', error);
        }
        if (state) {
          state.isHydrated = true;
        }
      },
    },
  ),
);
