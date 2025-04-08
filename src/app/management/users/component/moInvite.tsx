'use client';

import Image from 'next/image';

import { Input } from '@/components/ui/Input_auth';
import { Button } from '@/components/ui/Button';

export default function MversionInvite() {
  return (
    <>
      {/* 제목 */}
      <div>
        <h1 className='text-[32px] my-[30px] font-semibold text-[#1F1F1F]'>
          회원 관리
        </h1>

        <Button
          className='w-full tb:max-w-[214px] text-[14px] gap-0 text-[#F97B22]'
          variant='ghost'
          //   onClick={() => setInviteModalOpen(true)}
        >
          <div className=' w-6 h-6 flex items-center justify-center text-[#F97B22] hover:text-orange-600'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M12 4v16m8-8H4'
              />
            </svg>
          </div>
          <span>회원 초대하기</span>
        </Button>
      </div>
      {/* 검색창 + 버튼 */}
      <div className='border border-amber-300 w-full flex justify-end items-center gap-[24px] mb-6'>
        <div className='flex flex-col gap-[4px] w-full max-w-[402px]'>
          <Input
            name='password'
            tabIndex={2}
            placeholder='이름으로 검색하세요'
            isModified={true}
            required
            autoComplete='current-password'
            iconPosition='left'
            height={'l'}
          >
            <Image
              src='/icon/lined/search-md.svg'
              alt='검색'
              width={36}
              height={36}
            />
          </Input>
        </div>
      </div>
    </>
  );
}
