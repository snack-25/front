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
          console.log('loginData', loginData);
          const { id, companyId, companyName, ...res } = loginData.data;

          console.log('🪵 백엔드 응답 loginData.data:', loginData.data);

          console.log('🧩 id:', id);
          console.log('🧩 companyId:', companyId);

          if (loginData) {
            const userInfo = {
              ...res,
              id,
            };

            const companyInfo = { companyId, companyName };

            console.log('✅ 저장될 user:', userInfo);
            console.log('✅ 저장될 company:', companyInfo);

            set({ user: userInfo, company: companyInfo, isAuth: true });
            return loginData;
          } else {
            set({ user: null, company: null, isAuth: false });
            return false;
          }
        } catch (error) {
          console.error('로그인 실패:', error);
          return error;
        }
      },

      // 로그아웃 (상태 초기화 + localStorage 삭제)
      logout: async () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('버튼 누른거');
        }
        await logoutApi();
        set({ user: null, company: null, isAuth: false });
      },
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
      // getStorage: () => localStorage, // localStorage에 저장
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
