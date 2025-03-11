'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { HeaderMenu } from './HeaderMenu';
import { cn } from '@/lib/utils';

/* ### 사용자 타입(UserTypes)

일반유저 : basicUser

관리자 : admin

슈퍼관리자 : superAdmin, supervisor */

interface Imock {
  isAuthenticated: boolean;
  userType?: 'basicUser' | 'admin' | 'superAdmin';
}

const mock: Imock[] = [
  { isAuthenticated: false },
  { isAuthenticated: true, userType: 'basicUser' },
  { isAuthenticated: true, userType: 'admin' },
  { isAuthenticated: true, userType: 'superAdmin' },
];

interface navItemProps {
  href: string;
  currentPath: string;
  children: React.ReactNode;
}

const hoverStyle: string =
  'transition-all ease-in-out duration-300 hover:text-primary-400';

const NavItem = ({ href, currentPath, children }: navItemProps) => {
  const isActive = href === currentPath;
  return (
    <Link
      href={href}
      className={cn(hoverStyle, isActive && 'text-primary-400')}
    >
      {children}
    </Link>
  );
};

/**
 * 웹 애플리케이션의 헤더 UI를 렌더링하는 컴포넌트.
 *
 * 사용자의 인증 상태 및 타입, 그리고 현재 경로를 기반으로 다른 헤더 구성을 보여줍니다.
 * 인증된 사용자에게는 다양한 네비게이션 아이템(상품 리스트, 구매 관련 내역, 상품 등록 내역 등)과 로그아웃 버튼 및 관련 아이콘이 표시되며,
 * 인증되지 않은 사용자에게는 로그인 및 관리자 회원가입 링크를 제공합니다.
 */
export default function Header() {
  const user: Imock = mock[3];
  const pathname: string = usePathname();
  const isAuthPage: boolean = pathname === '/login' || pathname === '/signUp';

  return (
    <>
      {user.isAuthenticated ? (
        <header className='sticky top-0 lt:h-[88px] tb:h-16 mb:h-[54px] flex border-b-1 border-b-line-200 items-center lt:px-[120px] max-lt:px-6 bg-background-400 whitespace-nowrap'>
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
              <NavItem
                href='/productList'
                currentPath={pathname}
              >
                상품 리스트
              </NavItem>
              {user.userType === 'basicUser' && (
                <NavItem
                  href='/'
                  currentPath={pathname}
                >
                  구매 요청 내역
                </NavItem>
              )}
              {user.userType !== 'basicUser' && (
                <div className='flex gap-12'>
                  <NavItem
                    href='/'
                    currentPath={pathname}
                  >
                    구매 요청 관리
                  </NavItem>
                  <NavItem
                    href='/'
                    currentPath={pathname}
                  >
                    구매 내역 확인
                  </NavItem>
                </div>
              )}
              <NavItem
                href='/'
                currentPath={pathname}
              >
                상품 등록 내역
              </NavItem>
              {user.userType === 'superAdmin' && (
                <NavItem
                  href='/'
                  currentPath={pathname}
                >
                  관리
                </NavItem>
              )}
            </div>

            <div className='flex items-center gap-12 mx-auto max-tb:hidden'>
              <NavItem
                href='/'
                currentPath={pathname}
              >
                Cart
              </NavItem>
              <NavItem
                href='/'
                currentPath={pathname}
              >
                Profile
              </NavItem>
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
          className={`sticky top-0 bg-primary-400 lt:h-[88px] tb:h-16 mb:h-[54px] flex border-b-1 border-b-line-200 items-center lt:px-[120px] tb:px-6 whitespace-nowrap
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
