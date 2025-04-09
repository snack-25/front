'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function ManagementTabMenu() {
  const router = useRouter(); // 페이지 이동을 위한 Next.js 라우터
  const pathname = usePathname(); // 현재 경로 확인

  // 상단 관리용 탭 정의
  const tabs = [
    { name: '회원 관리', path: '/management/users' },
    { name: '예산 관리', path: '/management/budget' },
  ];

  return (
    <nav className='w-full border-b border-gray-200 px-[120px] max-lt:px-6 '>
      <ul className='flex gap-6 py-4 text-lg font-medium text-gray-500'>
        {tabs.map((tab) => (
          <li
            key={tab.path}
            className={`cursor-pointer ${
              pathname === tab.path
                ? 'text-primary-400 border-b-2 border-primary-400'
                : ''
            }`}
            onClick={() => router.push(tab.path)}
          >
            {tab.name}
          </li>
        ))}
      </ul>
    </nav>
  );
}
