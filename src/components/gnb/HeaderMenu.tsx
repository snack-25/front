'use client';

import Image from 'next/image';
import * as React from 'react';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/Dropdown-Menu';

import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useAuthStore } from '@/app/auth/useAuthStore';

export function HeaderMenu() {
  const [open, setOpen] = React.useState<boolean>(false);
  const { logout } = useAuthStore();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
    >
      <DropdownMenuTrigger asChild>
        <button className='cursor-pointer tb:hidden focus:outline-none'>
          <Image
            src='/icon/lined/hamburger-menu-md.svg'
            width={24}
            height={24}
            alt='hamburger menu'
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 tb:w-[550px]'>
        <DropdownMenuLabel>
          {
            <div className='flex items-center justify-between'>
              <label className='font-bold text-xl'>메뉴</label>
              <button
                onClick={handleClose}
                className='cursor-pointer'
              >
                <Image
                  src='/icon/lined/close-md.svg'
                  width={36}
                  height={36}
                  alt='close button'
                />
              </button>
            </div>
          }
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className='flex flex-col gap-8 text-xl font-medium px-4'>
          <DropdownMenuItem asChild>
            <Link href='/productList'>상품 리스트</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/request'>구매 요청 내역</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/request'>구매 요청 관리</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/history'>구매 내역 확인</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/productEntry'>상품 등록 내역</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/management/users'>관리</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button
              onClick={logout}
              className='text-left'
            >
              로그아웃
            </button>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
