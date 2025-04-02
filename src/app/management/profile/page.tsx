'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input_auth';
import { Button } from '@/components/ui/Button';
import ManagementTabMenu from '@/components/gnb/ManagementTabMenu';

// 테스트용 유저 타입 (이후 실제 로그인 유저 정보로 교체 예정)
type UserRole = 'basicUser' | 'admin' | 'superAdmin';

export default function ProfilePage() {
  // 로그인 유저 정보 예시 (실제로는 API로 받아야 함)
  const [user] = useState({
    name: '김스낵',
    email: 'snack@codeit.com',
    company: '스낵25 주식회사',
    role: 'superAdmin' as UserRole,
  });

  // 입력 값 상태 (회사명, 비밀번호 변경)
  const [companyName, setCompanyName] = useState(user.company);
  const [password, setPassword] = useState('');

  return (
    <div className='px-[120px] py-8 bg-[#FFFBF6] min-h-screen'>
      {/* GNB 하단 탭 */}
      <ManagementTabMenu />

      <h1 className='text-2xl font-bold mt-10 mb-10'>프로필</h1>

      {/* 프로필 정보 영역 */}
      <div className='flex flex-col gap-6 max-w-[640px] bg-white p-8 rounded-xl border border-gray-200'>
        {/* 이름 (읽기 전용) */}
        <Input
          titleClassName='이름'
          name='name'
          value={user.name}
          disabled
        />

        {/* 이메일 (읽기 전용) */}
        <Input
          titleClassName='이메일'
          name='email'
          value={user.email}
          disabled
        />

        {/* 기업명 - superAdmin만 편집 가능 */}
        <Input
          titleClassName='기업명'
          name='company'
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          disabled={user.role !== 'superAdmin'}
        />

        {/* 비밀번호 변경 입력 */}
        <Input
          titleClassName='새 비밀번호'
          name='password'
          placeholder='새 비밀번호를 입력하세요'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 버튼 */}
        <div className='flex gap-4 mt-4'>
          {user.role === 'superAdmin' && (
            <Button
              className='flex-1'
              filled='orange'
              onClick={() => alert('기업명 변경')}
            >
              기업명 수정
            </Button>
          )}
          <Button
            className='flex-1'
            filled='orange'
            onClick={() => alert('비밀번호 변경')}
          >
            비밀번호 변경
          </Button>
        </div>
      </div>
    </div>
  );
}
