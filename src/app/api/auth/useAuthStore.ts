import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { loginApi, logoutApi } from './api';
import { initFormType } from '@/app/auth/login/page';
import { persist } from 'zustand/middleware'; // 로컬스토리지 사용할 시

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
  name: string;
  id: string;
}

// Zustand Store 타입 정의
interface AuthState {
  user: userInfo | null;
  company: companyInfo | null;
  isAuth: boolean;
  login: (form: initFormType) => Promise<boolean>;
  logout: () => void;
}

// Zustand Store 생성
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      company: null,
      isAuth: false,

      // 로그인 (API 호출 후 상태 업데이트 + localStorage 저장)
      login: async (form) => {
        try {
          const loginData = await loginApi(form);
          const { company, companyId, ...rest } = loginData.data;

          if (loginData) {
            set({ user: rest, company, isAuth: true });
            return true;
          } else {
            set({ user: null, company: null, isAuth: false });
            return false;
          }
        } catch (error) {
          console.error('로그인 실패:', error);
          return false;
        }
      },

      // 로그아웃 (상태 초기화 + localStorage 삭제)
      logout: async () => {
        console.log('버튼 누른거');
        await logoutApi();
        set({ user: null, company: null, isAuth: false });
      },
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
      // getStorage: () => localStorage, // localStorage에 저장
    },
  ),
);
