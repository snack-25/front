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
import { Input } from '@/components/ui/Input_auth';
import { Button } from '@/components/ui/Button';
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
      className={`text-sm font-medium px-2 h-[36px] min-w-auto flex items-center justify-center rounded-full ${
        isAdmin
          ? 'bg-background-500 text-primary-400'
          : 'bg-background-300 text-gray-500'
      }`}
    >
      {role === 'SUPERADMIN' ? '최종관리자' : isAdmin ? '관리자' : '일반'}
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
    <div className=' bg-[##FBF8F4] min-h-screen'>
      <div className=' flex flex-col max-w-[1680px] m-auto'>
        <h1 className='text-[32px] my-[30px] font-semibold text-[#1F1F1F]'>
          회원 관리
        </h1>

        {/* 🔍 검색창 + 초대 버튼 */}
        <div className='border border-amber-300 w-full flex justify-end items-center gap-[24px] mb-6'>
          <div className='flex flex-col gap-[4px] w-full max-w-[402px]'>
            <Input
              placeholder='이름으로 검색하세요'
              isModified={true}
              required
              iconPosition='left'
              height='l'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

        {/* 📋 테이블 헤더 */}
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col h-[80px] bg-white border border-[#E0E0E0] rounded-[100px] text-[20px] text-gray-500 items-center'>
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

          {/* 🧍 사용자 리스트 */}
          <div className='border border-red-300  bg-[#FBF8F4] max-w-[1680px] w-full flex flex-col gap-4'>
            {/* 테이블 바디 */}
            <div className='flex flex-col gap-0'>
              <div className='max-w-[1520px] w-full mx-auto'>
                {users.map((user) => (
                  <div
                    key={user.id}
                    className=' w-full justify-around flex h-[104px]  border-[#E6E6E6] items-center'
                  >
                    {/* 왼쪽 그룹 */}
                    <div className=' w-full flex gap-0 text-[#6B6B6B]'>
                      <div className='ml-[14px] tb:ml-[20px] tb:max-w-[320px] max-w-[180px] w-full flex justify-start items-center gap-2 text-[20px]'>
                        <Image
                          src={getProfileImage(user.role)}
                          alt={`${user.role} 프로필`}
                          width={48}
                          height={48}
                        />
                        {user.name}
                      </div>
                      <div className='max-w-[400px] flex justify-start items-center text-[20px] '>
                        {user.email}
                      </div>
                    </div>

                    {/* 오른쪽 그룹 */}
                    <div className='max-w-[524px] justify-between w-full flex '>
                      <div className='max-w-[250px] w-full flex justify-center items-center'>
                        <RoleChip role={user.role as 'admin' | 'user'} />
                      </div>
                      <div className='max-w-[250px] flex justify-center tb:text-[16px] items-center gap-2'>
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
    </div>
  );
}
