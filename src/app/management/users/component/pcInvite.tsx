'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/Input_auth';
import { Button } from '@/components/ui/Button';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

type PcversionInviteProps = {
  users: User[];
  getProfileImage: (role: 'admin' | 'user') => string;
  RoleChip: React.ComponentType<{ role: 'admin' | 'user' }>;
};

export default function PcversionInvitePcversionInvite({
  users,
  getProfileImage,
  RoleChip,
}: PcversionInviteProps) {
  return (
    <>
      {/* 제목 */}
      <h1 className='text-[32px] my-[30px] font-semibold text-[#1F1F1F]'>
        회원 관리
      </h1>
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
        <Button
          className='w-full max-w-[214px]'
          filled={'orange'}

          //   onClick={() => setInviteModalOpen(true)}
        >
          회원 초대하기
        </Button>
      </div>

      {/* 테이블 헤더 */}
      <div className='flex flex-col h-[80px] bg-white border border-[#E0E0E0] rounded-[100px] px-[80px] text-[20px] text-gray-500 items-center'>
        <div className='max-w-[1520px] w-full justify-between items-center flex h-full'>
          {/* 왼쪽 그룹 */}
          <div className='max-w-[590px] w-full flex gap-[40px] items-center'>
            {/* 이름 */}
            <div className='max-w-[250px] w-full flex items-center justify-center'>
              <img
                src='/icon/flat/profile-md.svg'
                alt=''
                className='invisible w-6 h-6'
              />
              <span>이름</span>
            </div>
            {/* 메일 */}
            <div className='max-w-[300px] w-full flex items-center justify-center'>
              <div className='h-[24px] flex items-center'>
                <span>메일</span>
              </div>
            </div>
          </div>

          {/* 오른쪽 그룹 */}
          <div className='max-w-[524px] w-full flex gap-[24px] items-center'>
            {/* 권한 */}
            <div className=' w-full flex justify-center items-center'>
              <div className='h-[36px] flex items-center'>
                <span>권한</span>
              </div>
            </div>
            {/* 비고 */}
            <div className=' w-full flex justify-center items-center'>
              <div className='h-[36px] flex items-center'>
                <span>비고</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 찐 */}
      {/* 테이블 전체 */}
      <div className='border border-red-300 flex flex-col gap-4'>
        {/* 테이블 바디 */}
        <div className='flex flex-col gap-0'>
          {users.map((user) => (
            <div
              key={user.id}
              className='flex h-[104px] bg-[#FBF8F4] border-b border-[#E6E6E6] px-[80px] items-center'
            >
              {/* 왼쪽 그룹 */}
              <div className='w-[720px] flex gap-0 text-[#6B6B6B]'>
                <div className='w-[320px] flex justify-start items-center gap-2 text-[20px]'>
                  <Image
                    src={getProfileImage(user.role)}
                    alt={`${user.role} 프로필`}
                    width={48}
                    height={48}
                  />
                  {user.name}
                </div>
                <div className='w-[400px] flex justify-start items-center text-[20px] '>
                  {user.email}
                </div>
              </div>

              {/* 오른쪽 그룹 */}
              <div className='w-[480px] flex gap-0 ml-auto'>
                <div className='w-[120px] flex justify-center items-center'>
                  <RoleChip role={user.role as 'admin' | 'user'} />
                </div>
                <div className='w-[360px] flex justify-center tb:text-[16px] items-center gap-2'>
                  <Button
                    filled='gray'
                    className=' text-[#999999] px-[16px] py-[8px]'
                    height='tb:h-[42px]'
                    rounded='rounded-[8px]'
                    // onClick={() => setIsUnsubscribeModalOpen(true)}
                  >
                    계정 탈퇴
                  </Button>
                  <Button
                    filled='orange'
                    height='tb:h-[42px]'
                    rounded='rounded-[8px]'
                    className='px-[16px] py-[8px]'
                  >
                    권한 변경
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
