import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 로컬스토리지 사용할 시

import { initFormType } from '@/app/auth/login/page';

import { loginApi, logoutApi } from './api';

// JWT 토큰 구조 정의 (백엔드에서 어떤 정보를 주는지에 따라 다름)
interface userInfo {
  id: string;
  email: string;
  name: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'USER';
  cartId: string;
  companyId: string;
  companyName: string;
}

interface companyInfo {
  companyId: string;
  companyName: string;
}

// Zustand Store 타입 정의
interface AuthState {
  user: userInfo | null;
  company: companyInfo | null;
  isAuth: boolean;
  isHydrated: boolean;
  login: (form: initFormType) => Promise<any>;
  logout: () => void;
  edit: (companyName: string) => void;
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

          if (loginData.status !== 200) {
            return {
              status: loginData.status,
              message: loginData.message,
            };
          }

          const { user, token } = loginData.data.data;

          if (!user) {
            throw new Error('로그인 실패: 사용자 정보가 없습니다.');
          }

          set({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              cartId: user.cartId,
              companyId: user.companyId,
              companyName: user.companyName,
            },
            company: {
              companyId: user.companyId,
              companyName: user.companyName,
            },
            isAuth: true,
          });

          return loginData;
        } catch (error: any) {
          if (error.response) {
            return {
              status: error.response.status,
              message: error.response.data?.message || '로그인 실패',
            };
          }
          return { status: 500, message: '서버 오류 발생' };
        }
      },

      // 로그아웃 (상태 초기화 + localStorage 삭제)
      logout: async () => {
        try {
          await logoutApi();
          set({ user: null, company: null, isAuth: false });
        } catch (e) {
          console.error('로그아웃 실패:', e);
        } finally {
          window.history.replaceState(null, '', '/');
        }
        // if (process.env.NODE_ENV === 'development') {
        //   console.log('로그아웃 ');
        // }
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
