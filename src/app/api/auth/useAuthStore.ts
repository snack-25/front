import { create } from 'zustand';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// 백엔드에서 보내는거
// user {
//   email: 'test1111@naver.com',
//   name: '찐찐막',
//   role: 'SUPERADMIN',
//   company: { name: '찐찐막', id: 'ywkvll8eg16s83zcnik2gg1j' },
// }

// JWT 토큰 구조 정의 (백엔드에서 어떤 정보를 주는지에 따라 다름)
interface DecodedToken {
  id: number;
  email: string;
  name: string;
  company: {
    name: string;
    id: string;
  };
  companyId: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'USER';
}

// Zustand Store 타입 정의
interface AuthState {
  user: DecodedToken | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Zustand Store 생성
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  // 로그인 시 실행 (토큰을 쿠키에서 읽고 상태 업데이트)
  login: () => {
    const token = Cookies.get('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log('📌 디코딩된 토큰:', decoded); // 🔥 콘솔에서 자동 확인
        set({ user: decoded, isAuthenticated: true });
      } catch (error) {
        console.error('토큰 디코딩 오류:', error);
      }
    }
  },

  // 로그아웃 시 실행 (상태 초기화 및 쿠키 삭제)
  logout: () => {
    Cookies.remove('accessToken');
    set({ user: null, isAuthenticated: false });
  },
}));
