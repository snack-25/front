'use client';

import { Button } from '@ui/Button';
import Link from 'next/link';
import { useAuthStore } from '@/app/auth/useAuthStore';

function MobileLoginBox() {
  const { user, isAuth, logout } = useAuthStore();
  const isLogin = user && isAuth;
  return (
    <div className='gird-cols-1 min-[744px]:hidden grid justify-center w-full gap-2 pt-8 pb-10'>
      {isLogin && (
        <Button
          variant='outline'
          outlined='orange'
          onClick={logout}
          className='rounded-full bg-white w-[194px] h-10 cursor-pointer'
        >
          로그아웃
        </Button>
      )}
      {!isLogin && (
        <>
          <Link href='/auth/login'>
            <Button
              variant='outline'
              outlined='orange'
              className='rounded-full bg-white w-[194px] h-10 cursor-pointer'
            >
              로그인
            </Button>
          </Link>
          <Link href='/auth/signup'>
            <Button
              variant='outline'
              outlined='orange'
              className='rounded-full bg-white w-[194px] h-10 cursor-pointer'
            >
              관리자 회원가입
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}

export { MobileLoginBox };
