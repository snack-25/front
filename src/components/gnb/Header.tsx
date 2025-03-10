'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { HeaderMenu } from './HeaderMenu';

/* ### 사용자 타입(UserTypes)

일반유저 : basicUser

관리자 : admin

슈퍼관리자 : superAdmin, supervisor */

interface Imock {
  isAuthenticated: boolean;
  userType?: string;
}

const mock: Imock[] = [
  { isAuthenticated: false },
  { isAuthenticated: true, userType: 'basicUser' },
  { isAuthenticated: true, userType: 'admin' },
  { isAuthenticated: true, userType: 'superAdmin' },
];

export default function Header() {
  const user: Imock = mock[3];
  const pathname: string = usePathname();
  const isAuthPage: boolean = pathname === '/login' || pathname === '/signUp';

  const hoverStyle: string =
    'transition-all ease-in-out duration-300 hover:text-primary-400';

  return (
    <>
      {user.isAuthenticated ? (
        <header className='sticky top-0 lt:h-[88px] tb:h-16 mb:h-[54px] flex items-center lt:px-[120px] max-lt:px-6 bg-background-400 whitespace-nowrap'>
          <div className='flex items-center justify-between text-gray-400 font-bold text-[1.4vw] w-full mx-auto'>
            <div className='flex items-center gap-6'>
            <HeaderMenu />

              <Link
                href='/'
                className='w-[10vw] mr-16'
              >
                <Image
                  src='/img/gnb/gnb-logo-primary.svg'
                  width={126}
                  height={32}
                  alt='gnb snack logo'
                  className='max-tb:w-20 max-tb:h-[54px]'
                />
              </Link>
            </div>

            <div className='flex gap-8 max-tb:hidden'>
              <Link
                href='/productList'
                className={`${hoverStyle}`}
              >
                상품 리스트
              </Link>
              {user.userType === 'basicUser' && (
                <Link
                  href='/'
                  className={`${hoverStyle}`}
                >
                  구매 요청 내역
                </Link>
              )}
              {user.userType !== 'basicUser' && (
                <div className='flex gap-12'>
                  <Link
                    href='/'
                    className={`${hoverStyle}`}
                  >
                    구매 요청 관리
                  </Link>
                  <Link
                    href='/'
                    className={`${hoverStyle}`}
                  >
                    구매 내역 확인
                  </Link>
                </div>
              )}
              <Link
                href='/'
                className={`${hoverStyle}`}
              >
                상품 등록 내역
              </Link>
              {user.userType === 'superAdmin' && (
                <Link
                  href='/'
                  className={`${hoverStyle}`}
                >
                  관리
                </Link>
              )}
            </div>

            <div className='flex items-center gap-12 mx-auto max-tb:hidden'>
              <Link
                href='/'
                className={`${hoverStyle}`}
              >
                Cart
              </Link>
              <Link
                href='/'
                className={`${hoverStyle}`}
              >
                Profile
              </Link>
              <Button
                className={`bg-transparent hover:bg-transparent text-gray-400 text-[1.4vw] font-bold w-auto h-auto cursor-pointer ${hoverStyle}`}
              >
                Logout
              </Button>
            </div>

            <div className='flex items-center gap-4 tb:hidden'>
              <button className='cursor-pointer'>
                <Image
                  src='/icon/flat/cart-outlined-md.svg'
                  width={24}
                  height={24}
                  alt='cart-outlined'
                />
              </button>
              <button className='cursor-pointer'>
                <Image
                  src='/icon/flat/profile-md.svg'
                  width={24}
                  height={24}
                  alt='profile icon'
                />
              </button>
            </div>
          </div>
        </header>
      ) : (
        <header
          className={`sticky top-0 bg-primary-400 lt:h-[88px] tb:h-16 mb:h-[54px] flex items-center lt:px-[120px] tb:px-6 whitespace-nowrap
          ${isAuthPage ? 'justify-center' : 'justify-between max-tb:justify-center'}`}
        >
          <Link href='/'>
            <Image
              src='/img/gnb/gnb-logo-md.svg'
              width={126}
              height={32}
              alt='gnb snack logo'
            />
          </Link>

          {!isAuthPage && (
            <div className='text-white font-bold flex lt:w-[290px] tb:w-[205px] justify-around max-tb:hidden'>
              <Link href='/login'>로그인</Link>
              <Link href='/signUp'>관리자 회원가입</Link>
            </div>
          )}
        </header>
      )}
    </>
  );
}
