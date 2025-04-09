'use client';

import { useAuthStore } from '@/app/auth/useAuthStore';
import Loading from '../productList/Loading';
import GuestHeader from './GuestHeader';
import UserHeader from './UserHeader';

export default function Header() {
  const { user, isAuth, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return <Loading size='S' />;
  }

  if (user && isAuth) {
    //로그인 상태
    return <UserHeader user={user} />;
  }

  return <GuestHeader />; //비로그인 상태
}
