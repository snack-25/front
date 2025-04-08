'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getUserListApi } from '@/app/api/users/api';
import { useAuthStore } from '@/app/api/auth/useAuthStore';
import ManagementTabMenu from '@/components/gnb/ManagementTabMenu';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import InviteMemberModal from '@/components/ui/modal/InviteMemberModal';

// 🔹 API 응답 타입 정의
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'basicUser';
};

type GetUserListResponse = {
  totalCount: number;
  users: User[];
};

const getProfileImage = (role: string) =>
  role === 'admin'
    ? '/icon/flat/profile-admin-md.svg'
    : '/icon/flat/profile-md.svg';

const RoleChip = ({ role }: { role: 'admin' | 'basicUser' }) => {
  const isAdmin = role === 'admin';
  return (
    <span
      className={`text-sm font-medium px-2 h-[36px] w-[51px] flex items-center justify-center rounded-full ${
        isAdmin
          ? 'bg-background-500 text-primary-400'
          : 'bg-background-300 text-gray-500'
      }`}
    >
      {isAdmin ? '관리자' : '일반'}
    </span>
  );
};

export default function UserManagementPage() {
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const { user } = useAuthStore();

  // ✅ Step 1. 실제 유저 리스트 상태
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response: GetUserListResponse = await getUserListApi({
          page: 1,
          limit: 10,
        });
        setUsers(response.users);
        setTotalCount(response.totalCount);
      } catch (error) {
        console.error('❌ 회원 목록 불러오기 실패:', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className='bg-[#FFFBF6] min-h-screen'>
      <div className='px-[120px] pt-4 max-lt:px-6'>
        <div className='w-[1680px] mx-auto'>
          <h1 className='text-[24px] font-bold text-[#1F1F1F] mt-2 mb-6'>
            회원 관리
          </h1>

          <div className='flex justify-end items-center gap-4 mb-6'>
            <div className='relative'>
              <Input
                placeholder='이름으로 검색하세요'
                className='w-[360px] h-[48px] pl-10 pr-4 rounded-[16px] text-base'
              />
              <Image
                src='/icon/lined/search-md.svg'
                alt='검색'
                width={20}
                height={20}
                className='absolute left-4 top-1/2 -translate-y-1/2'
              />
            </div>
            <Button
              className='bg-primary-400 text-white font-semibold px-6 py-3 rounded-xl'
              onClick={() => setInviteModalOpen(true)}
            >
              회원 초대하기
            </Button>
          </div>

          {/* ✅ 테이블 헤더 */}
          <div className='flex h-[104px] bg-white border border-[#E0E0E0] rounded-[100px] px-[80px] text-sm text-gray-500 font-semibold items-center'>
            <div className='w-[720px] flex gap-0 items-center'>
              <div className='w-[320px] flex items-center gap-2'>
                <img
                  src='/icon/flat/profile-md.svg'
                  alt=''
                  className='invisible w-6 h-6'
                />
                <span>이름</span>
              </div>
              <div className='w-[400px] flex items-center'>
                <span>메일</span>
              </div>
            </div>
            <div className='w-[480px] flex gap-0 ml-auto items-center'>
              <div className='w-[120px] flex justify-center items-center'>
                <span>권한</span>
              </div>
              <div className='w-[360px] flex justify-center items-center'>
                <span>비고</span>
              </div>
            </div>
          </div>

          {/* ✅ 테이블 바디 */}
          <div className='flex flex-col gap-0'>
            {users.map((user) => (
              <div
                key={user.id}
                className='flex h-[104px] bg-[#FBF8F4] border-b border-[#E6E6E6] px-[80px] items-center'
              >
                <div className='w-[720px] flex gap-0'>
                  <div className='w-[320px] flex justify-start items-center gap-2 text-sm text-[#1F1F1F]'>
                    <img
                      src={getProfileImage(user.role)}
                      alt='user'
                      className='w-6 h-6'
                    />
                    {user.name}
                  </div>
                  <div className='w-[400px] flex justify-start items-center text-sm text-[#1F1F1F]'>
                    {user.email}
                  </div>
                </div>
                <div className='w-[480px] flex gap-0 ml-auto'>
                  <div className='w-[120px] flex justify-center items-center'>
                    <RoleChip role={user.role} />
                  </div>
                  <div className='w-[360px] flex justify-center items-center gap-2'>
                    <Button className='bg-gray-200 text-gray-600 rounded-md px-3 py-1 text-sm'>
                      계정 탈퇴
                    </Button>
                    <Button className='bg-primary-400 text-white rounded-md px-3 py-1 text-sm'>
                      권한 변경
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 🔹 페이지네이션은 후속 구현 가능 */}
        </div>
      </div>
      {/* ✅ 초대 모달 */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onConfirm={async (data) => {
          try {
            if (!user) {
              console.error('❌ user가 존재하지 않습니다.');
              alert('로그인이 필요합니다.');
              return;
            }

            if (!user.id) {
              console.error('❌ user.id가 존재하지 않습니다.', user);
              alert('유효하지 않은 사용자입니다.');
              return;
            }

            if (!user.companyId) {
              console.error('❌ user.companyId가 존재하지 않습니다.', user);
              alert('소속된 회사 정보가 없습니다.');
              return;
            }

            console.log('✅ 초대 요청 데이터:', {
              name: data.name,
              email: data.email,
              role: data.role,
              companyId: user.companyId,
              inviterId: String(user.id),
            });

            const response = await inviteUserApi({
              name: data.name,
              email: data.email,
              role: data.role,
              companyId: user.companyId,
              inviterId: String(user.id),
            });
            console.log('✅ 초대 완료:', response);
            alert('회원 초대가 완료되었습니다!');
          } catch (error) {
            console.error('❌ 초대 실패:', error);
            alert('회원 초대에 실패했습니다.');
          } finally {
            setInviteModalOpen(false);
          }
        }}
      />{' '}
    </div>
  );
}
