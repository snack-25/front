'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { inviteUserApi } from '@/app/api/users/api';
import { useAuthStore } from '@/app/auth/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input_auth';
import InviteMemberModal from '@/components/ui/modal/InviteMemberModal';
import Modal from '@/components/ui/modal/Modal';
import PcversionInvite from './component/pcInvite';
import MversionInvite from './component/moInvite';

type NarrowedUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

const mockUsers = [
  { id: 1, name: '김스낵', email: 'snack1@codeit.com', role: 'admin' },
  { id: 2, name: '박초코', email: 'choco@codeit.com', role: 'user' },
  { id: 3, name: '이감자', email: 'potato@codeit.com', role: 'user' },
  { id: 4, name: '최관리자', email: 'super@codeit.com', role: 'admin' },
];

const getProfileImage = (role: string) =>
  role === 'admin'
    ? '/icon/flat/profile-admin-md.svg'
    : '/icon/flat/profile-md.svg';

const RoleChip = ({ role }: { role: 'admin' | 'user' }) => {
  const isAdmin = role === 'admin';
  return (
    <span
      className={`text-[20px] font-medium py-[2px] px-[8px] flex items-center justify-center rounded-full ${
        isAdmin
          ? 'bg-background-500 text-primary-400'
          : 'bg-[#EFEFEF] text-[#999]'
      }`}
    >
      {isAdmin ? '관리자' : '일반'}
    </span>
  );
};

export default function UserManagementPage() {
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isUnsubscribeModalOpen, setIsUnsubscribeModalOpen] = useState(false);
  const { user, company } = useAuthStore();

  // 실제 최고관리자의 companyId 가지고 온다.
  // 그 이후 companyId에 속한 모든 사용자 정보를 가지고 온다.
  // 그 이후 사용자 정보를 테이블에 렌더링한다.
  const [users, setUsers] = useState<NarrowedUser[]>([]); // 타입도 바꿔줘

  const convertToTypedUsers = (rawUsers: any[]): NarrowedUser[] =>
    rawUsers.map((user) => ({
      ...user,
      role: user.role === 'admin' ? 'admin' : 'user',
    }));
  // 계정 권한 변경/탈퇴 모달에서 선택한 사용자 id
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    console.log('user', user);
    console.log('company', company);
    // const { companyId } = company;
    // company가 null이 아니면서 companyId가 있을 때만 진행합니다.
    if (!company?.companyId) return;

    const { companyId } = company; // 이제 TS 에러 없이 사용 가능

    const fetchUsers = async (body: { companyId: string }) => {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_URL + `/users/userlist`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            credentials: 'include',
          },
        );
        const { data: users } = await res.json();
        console.log('유저 목록:', users);
        setUsers(users);
        return { status: res.status, users };
      } catch (err) {
        console.error('유저 불러오기 실패:', err);
      }
    };

    fetchUsers({ companyId: companyId });

    const checkSize = () => {
      setIsTablet(window.innerWidth >= 745); // 예: tb = 745px
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, [company?.companyId]);

  // useEffect(() => {
  //   if (!company || !company.companyId) {
  //     console.error('회사 ID가 없습니다.');
  //     return;
  //   }

  //   const fetchUsers = async () => {
  //     try {
  //       const res = await fetch(
  //         process.env.NEXT_PUBLIC_API_URL + '/users/of-company',
  //         {
  //           method: 'GET',
  //           headers: { 'Content-Type': 'application/json' },
  //           credentials: 'include',
  //         },
  //       );
  //       if (!res.ok) {
  //         throw new Error('사용자 목록 가져오기 실패');
  //       }
  //       const data = await res.json();
  //       setUsers(data);
  //     } catch (error) {
  //       console.error('사용자 목록 가져오기 실패:', error);
  //       // alert('사용자 목록을 가져오는데 실패했습니다.');
  //     }
  //   };

  //   fetchUsers();
  // }, [company]);

  return (
    <div className='border border-black bg-[##FBF8F4] min-h-screen'>
      {/* pc기준으로  */}
      <div className='border border-b-purple-400 flex flex-col max-w-[1680px] m-auto'>
        <PcversionInvite
          users={users}
          getProfileImage={getProfileImage}
          RoleChip={RoleChip}
        ></PcversionInvite>
        {/* <MversionInvite></MversionInvite> */}

        {/* 페이지네이션 */}
        <div className='flex justify-center mt-10 gap-2 text-gray-500'>
          <button className='px-2'>&lt;</button>
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              className={`px-3 py-1 rounded ${
                num === 1 ? 'text-black font-bold' : ''
              }`}
            >
              {num}
            </button>
          ))}
          <button className='px-2'>&gt;</button>
        </div>
      </div>

      {/* <InviteMemberModal
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

            if (!company) {
              console.error('❌ company가 존재하지 않습니다.', company);
              alert('소속된 회사 정보가 없습니다.');
              return;
            }

            if (!company.companyId) {
              console.error(
                '❌ company.companyId가 존재하지 않습니다.',
                company.companyId,
              );
              alert('소속된 회사 정보가 없습니다.');
              return;
            }

            console.log('✅ 초대 요청 데이터:', {
              name: data.name,
              email: data.email,
              role: data.role,
              companyId: company.companyId,
              inviterId: String(user.id),
            });

            const response = await inviteUserApi({
              name: data.name,
              email: data.email,
              role: data.role,
              companyId: company.companyId,
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
      /> */}

      {/* <Modal
        open={isUnsubscribeModalOpen}
        onClose={() => setIsUnsubscribeModalOpen(false)}
        title='계정 탈퇴'
        description={`${user?.name}님의 계정을 탈퇴시킬까요?`}
        confirmText='탈퇴시키기'
        cancelText='더 생각해볼게요'
        imageSrc='/img/modal/important-md.svg'
        onConfirm={async () => {
          try {
            // 선택된 사용자 ID가 필요합니다 - 현재 구현에서는 이 정보가 없습니다
            // const selectedUserId = ...;
            // 실제 탈퇴 API 호출
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/users/${selectedUserId}`,
              {
                method: 'DELETE',
                credentials: 'include',
              },
            );
            alert('계정이 성공적으로 탈퇴되었습니다.');
          } catch (error) {
            console.error('계정 탈퇴 실패:', error);
            alert('계정 탈퇴에 실패했습니다.');
          } finally {
            setIsUnsubscribeModalOpen(false);
          }
        }}
      /> */}
    </div>
  );
}
