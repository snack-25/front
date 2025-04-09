'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  getUserListApi,
  updateUserRoleApi,
  deleteUserApi,
} from '@/app/api/users/api';
import { inviteUserApi } from '@/app/api/users/api';
import { useAuthStore } from '@/app/auth/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import InviteMemberModal from '@/components/ui/modal/InviteMemberModal';
import MemberRoleChangeModal from '@/components/ui/modal/MemberRoleChangeModal';
import Modal from '@/components/ui/modal/Modal';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const getProfileImage = (role: string) =>
  role === 'ADMIN' || role === 'SUPERADMIN'
    ? '/icon/flat/profile-admin-md.svg'
    : '/icon/flat/profile-md.svg';

const RoleChip = ({ role }: { role: string }) => {
  const isAdmin = role === 'ADMIN' || role === 'SUPERADMIN';
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
  const { user } = useAuthStore();
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // 전체 회원 수
  const limit = 10; // 한 페이지에 보여줄 회원 수
  const totalPages = Math.ceil(totalCount / limit); // ✅ 마지막 페이지 수 계산
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // 선택된 유저
  const [isRoleModalOpen, setRoleModalOpen] = useState(false); // 모달 열림 여부

  const [userToDelete, setUserToDelete] = useState<User | null>(null); // 삭제할 유저
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // 모달 열림 여부
  const handleOpenDeleteModal = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUserApi(userToDelete.id);
      alert('✅ 회원이 성공적으로 탈퇴되었습니다.');
      fetchUsers(); // 최신 목록으로 갱신
    } catch (error) {
      console.error('❌ 탈퇴 실패:', error);
      alert('⚠️ 회원 탈퇴에 실패했습니다.');
    } finally {
      setDeleteModalOpen(false);
    }
  };

  // ✅ 회원 목록 불러오기
  const fetchUsers = async () => {
    try {
      const response = await getUserListApi({ page, limit, search });
      if (response?.users) {
        setUsers(response.users);
        setTotalCount(response.totalCount); // ✅ 총 유저 수 저장
      }
    } catch (error) {
      console.error('❌ 사용자 목록 불러오기 실패:', error);
    }
  };

  // ✅ useEffect: 검색어 또는 페이지가 변경될 때마다 fetchUsers 실행
  useEffect(() => {
    // ✅ 디바운스 적용: 입력 후 300ms 뒤 API 호출
    if (!isRoleModalOpen) {
      const delay = setTimeout(() => {
        fetchUsers();
      }, 300); // debounce 줄이기 가능

      // ✅ 입력 도중에는 이전 요청 제거
      return () => clearTimeout(delay);
    }
  }, [search, page, isRoleModalOpen]); // 검색어, 페이지, 모달 열림 여부에 따라 실행

  // 🔽 권한 변경 버튼 클릭 시
  const handleOpenRoleModal = (user: User) => {
    setSelectedUser(user);
    setRoleModalOpen(true);
  };

  // 🔽 역할 변경 API 성공 후 후처리
  const handleRoleChangeSuccess = () => {
    setRoleModalOpen(false);
    fetchUsers(); // 권한 변경 후 최신 목록 다시 불러오기
  };

  // ✅ 이 함수는 MemberRoleChangeModal의 onConfirm에서 호출됨
  const handleRoleChangeConfirm = async (data: { role: string }) => {
    if (!selectedUser) return;

    try {
      await updateUserRoleApi({ userId: selectedUser.id, role: data.role }); // ✅

      alert('✅ 권한이 성공적으로 변경되었습니다.');
      handleRoleChangeSuccess(); // 모달 닫기 + fetchUsers 호출
    } catch (error) {
      console.error('❌ 권한 변경 실패:', error);
      alert('⚠️ 권한 변경에 실패했습니다.');
    }
  };

  return (
    <div className='bg-[#FFFBF6] min-h-screen'>
      <div className='px-[120px] pt-4 max-lt:px-6'>
        <div className='w-[1680px] mx-auto'>
          <h1 className='text-[24px] font-bold text-[#1F1F1F] mt-2 mb-6'>
            회원 관리
          </h1>

          {/* 🔍 검색창 + 초대 버튼 */}
          <div className='flex justify-end items-center gap-4 mb-6'>
            <div className='relative'>
              <Input
                placeholder='이름으로 검색하세요'
                className='w-[360px] h-[48px] pl-10 pr-4 rounded-[16px] text-base'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              className='bg-primary-400 text-white font-semibold px-6 py-3 rounded-xl cursor-pointer'
              onClick={() => setInviteModalOpen(true)}
            >
              회원 초대하기
            </Button>
          </div>

          {/* 📋 테이블 헤더 */}
          <div className='flex flex-col gap-4'>
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

            {/* 🧍 사용자 리스트 */}
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
                      <Button
                        className='bg-gray-200 text-gray-600 rounded-md px-3 py-1 text-sm'
                        onClick={() => handleOpenDeleteModal(user)}
                      >
                        계정 탈퇴
                      </Button>
                      <Button
                        className='bg-primary-400 text-white rounded-md px-3 py-1 text-sm'
                        onClick={() => handleOpenRoleModal(user)} // 선택된 유저 정보 전달
                      >
                        권한 변경
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ◀️ 페이지네이션 */}
          <div className='flex justify-center mt-10 gap-2 text-gray-500'>
            <button
              className='px-2'
              onClick={() => setPage((p) => Math.max(1, p - 1))} // 1 이하로는 안감
              disabled={page === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`px-3 py-1 rounded ${
                  num === page ? 'text-black font-bold' : ''
                }`}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}
            <button
              className='px-2'
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))} // 마지막 페이지 이상은 안감
              disabled={page === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* 📬 회원 초대 모달 */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onConfirm={async (data) => {
          try {
            console.log('✅ user:', user); // <- null or undefined 확인
            console.log('✅ company:', user?.companyId); // company 정보 확인
            if (!user?.id || !user?.companyId) {
              alert('로그인 또는 회사 정보가 누락되었습니다.');
              return;
            }

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
      />

      {selectedUser && (
        <MemberRoleChangeModal
          isOpen={isRoleModalOpen}
          onClose={() => setRoleModalOpen(false)}
          member={selectedUser}
          onConfirm={handleRoleChangeConfirm}
        />
      )}

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title='계정 탈퇴'
        description={`${userToDelete?.email}님의 계정을 탈퇴시킬까요?`}
        confirmText='탈퇴시키기'
        cancelText='더 생각해볼게요'
        imageSrc='/img/modal/important-md.svg'
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}
