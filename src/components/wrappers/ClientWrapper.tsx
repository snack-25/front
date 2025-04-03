'use client';

import { useAuthStore } from '@/app/api/auth/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface IProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: IProps) {
  const { isAuth, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !isAuth) {
      router.push('/notAuth');
    }
  }, [isAuth, isHydrated]);

  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
}
