'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthStore } from '@/app/auth/useAuthStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

import { HeaderMenu } from './HeaderMenu';

interface navItemProps {
  href: string;
  currentPath: string;
  children: React.ReactNode;
}

const hoverStyle: string =
  'transition-colors ease-in-out duration-300 hover:text-primary-400';

const NavItem = ({ href, currentPath, children }: navItemProps) => {
  const isActive = currentPath.includes(href);
  return (
    <Link
      href={href}
      className={cn(hoverStyle, isActive && 'text-primary-400')}
    >
      {children}
    </Link>
  );
};

export default function Header() {
  const { user, isAuth, isHydrated, logout } = useAuthStore();
  const router = useRouter();
  const pathname: string = usePathname();
  const isAuthPage: boolean =
    pathname === '/auth/login' || pathname === '/auth/signUp';

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      {user && isAuth ? (
        <header className='sticky z-1000 top-0 lt:h-[88px] tb:h-16 mb:h-[54px] min-h-[54px] flex border-b-1 border-b-line-200 items-center lt:px-[120px] max-lt:px-6 bg-background-400 whitespace-nowrap'>
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
                  priority
                />
              </Link>
            </div>

            <div className='flex gap-8 max-tb:hidden'>
              <Link
                href={{
                  pathname: '/productList',
                }}
                className={cn(
                  hoverStyle,
                  pathname.includes('/productList') && 'text-primary-400',
                )}
              >
                상품 리스트
              </Link>
              {user.role === 'USER' && (
                <NavItem
                  href='/my-request'
                  currentPath={pathname}
                >
                  구매 요청 내역
                </NavItem>
              )}
              {user.role !== 'USER' && (
                <div className='flex gap-12'>
                  <NavItem
                    href='/request'
                    currentPath={pathname}
                  >
                    구매 요청 관리
                  </NavItem>
                  <NavItem
                    href='/my-request'
                    currentPath={pathname}
                  >
                    구매 요청 내역
                  </NavItem>
                  <NavItem
                    href='/history'
                    currentPath={pathname}
                  >
                    구매 내역 확인
                  </NavItem>
                </div>
              )}
              <NavItem
                href='/productEntry'
                currentPath={pathname}
              >
                상품 등록 내역
              </NavItem>
              {user.role === 'SUPERADMIN' && (
                <NavItem
                  href='/management/users'
                  currentPath={pathname}
                >
                  관리
                </NavItem>
              )}
            </div>

            <div className='flex items-center gap-12 ml-auto max-tb:hidden'>
              <NavItem
                href={`/cart/${user.cartId}`}
                currentPath={pathname}
              >
                Cart
              </NavItem>
              <NavItem
                href='/management/profile'
                currentPath={pathname}
              >
                Profile
              </NavItem>
              <Button
                className={`bg-transparent hover:bg-transparent text-gray-400 text-[1.4vw] font-bold w-auto h-auto cursor-pointer ${hoverStyle}`}
                font='tb:text-[1.4vw]'
                onClick={async () => {
                  await logout();
                  router.push('/');
                }}
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
          className={`sticky z-1000 top-0 bg-primary-400 lt:h-[88px] tb:h-16 mb:h-[54px] flex border-b-1 border-b-line-200 items-center lt:px-[120px] tb:px-6 whitespace-nowrap
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
              <Link href='/auth/login'>로그인</Link>
              <Link href='/auth/signup'>관리자 회원가입</Link>
            </div>
          )}
        </header>
      )}
    </>
  );
}
