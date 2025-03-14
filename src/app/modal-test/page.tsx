'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/TextArea';
import BaseFormModal from '@/components/ui/modal/BaseFormModal';
import InviteMemberModal from '@/components/ui/modal/InviteMemberModal';
import MemberRoleChangeModal from '@/components/ui/modal/MemberRoleChangeModal';
import Modal from '@/components/ui/modal/Modal';
import ProductEditModal from '@/components/ui/modal/ProductEditModal';
import ProductFormModal from '@/components/ui/modal/ProductFormModal';
import PurchaseRequestModal from '@/components/ui/modal/PurchaseRequestModal';

// 유저 이메일 (실제 상황에서는 API 또는 상태에서 가져올 것)
const userEmail = '김스낵(sn@codeit.com)';

export default function ModalTestPage() {
  // 모달별 상태
  const [isCancelRequestOpen, setIsCancelRequestOpen] = useState(false);
  const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isApprovalCompleteOpen, setIsApprovalCompleteOpen] = useState(false);
  const [isRejectRequestOpen, setIsRejectRequestOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  // BaseForm
  const [isBaseFormOpen, setIsBaseFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const isConfirmDisabled = name.length < 3 || description.length < 8;

  // InviteMemberModal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // 초대 확인 핸들러 (react-hook-form의 데이터 받기)
  const handleInviteConfirm = (data: {
    name: string;
    email: string;
    role: string;
  }) => {
    console.log('초대 정보:', data); // 입력한 값 확인
    setIsInviteModalOpen(false); // 모달 닫기
  };

  // 회원 권한 변경 모달
  const [isMemberRoleModalOpen, setIsMemberRoleModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState({
    name: '김스낵',
    email: 'sn@codeit.com',
    role: '관리자',
  });

  const handleRoleChangeConfirm = (data: {
    name: string;
    email: string;
    role: string;
  }) => {
    console.log('변경된 정보:', data);
    setIsMemberRoleModalOpen(false);
  };

  // 상품 등록 모달 상태
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // 상품 등록 핸들러
  const handleProductConfirm = (data: {
    name: string;
    category: string;
    subCategory: string;
    price: number;
    image: File | null;
    link: string;
  }) => {
    const formattedData = {
      ...data,
      price: Number(data.price), // 숫자로 변환하여 전달
    };

    console.log('등록된 상품 정보:', formattedData);
    setIsProductModalOpen(false);
  };

  // 상품 수정 모달
  // 테스트용 상품 데이터
  const testProduct = {
    id: '1',
    name: '테스트 상품',
    category: '스낵',
    subCategory: '과자',
    price: 1500,
    imageUrl: '/img/input/profile/upload-filled-md.svg',
    link: 'https://example.com',
  };

  // 상품 수정 핸들러
  const handleUpdate = (updatedData: any) => {
    console.log('수정된 상품 데이터:', updatedData);
    setIsEditModalOpen(false);
  };

  // 구매 요청 모달
  // 테스트용 상품 데이터
  const testPurchaseData = {
    requester: '김스낵',
    items: [
      {
        id: '1',
        name: '코카콜라 제로',
        category: '청량 · 탄산음료',
        quantity: 4,
        price: 2000,
        imageUrl: '/img/card/item-coke-zero.png',
      },
      {
        id: '2',
        name: '코카콜라 제로',
        category: '청량 · 탄산음료',
        quantity: 4,
        price: 2000,
        imageUrl: '/img/card/item-coke-zero.png',
      },
      {
        id: '3',
        name: '코카콜라 제로',
        category: '청량 · 탄산음료',
        quantity: 4,
        price: 2000,
        imageUrl: '/img/card/item-coke-zero.png',
      },
      {
        id: '4',
        name: '코카콜라 제로',
        category: '청량 · 탄산음료',
        quantity: 4,
        price: 2000,
        imageUrl: '/img/card/item-coke-zero.png',
      },
    ],
    totalAmount: 32000, // 총합 수정
  };

  // 구매 요청 버튼 클릭 핸들러
  const handlePurchaseRequest = () => {
    console.log('🛒 구매 요청 완료:', testPurchaseData);
    setIsPurchaseModalOpen(false); // 모달 닫기
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen space-y-6'>
      <h1 className='text-2xl font-bold mb-4'>Modal 테스트 페이지</h1>
      <div className='flex flex-col space-y-4'>
        {/* 구매 요청 취소 모달 */}
        <Button
          onClick={() => setIsCancelRequestOpen(true)}
          className='bg-black text-white hover:bg-gray-800 active:bg-gray-900 px-6 py-3 text-lg min-w-[180px] rounded-lg'
        >
          구매 요청 취소 열기
        </Button>
        <Modal
          open={isCancelRequestOpen}
          onClose={() => setIsCancelRequestOpen(false)}
          title='구매 요청 취소'
          description={[
            '코카콜라 외 1건 구매 요청을 취소하시겠어요?',
            '구매 요청 취소 후에는 복구할 수 없어요!',
          ]}
          confirmText='취소할래요'
          cancelText='더 생각해볼게요'
          imageSrc='/img/modal/important-md.svg'
          onConfirm={() => setIsCancelRequestOpen(false)}
        />

        {/* 상품 삭제 모달 */}
        <Button
          onClick={() => setIsDeleteProductOpen(true)}
          className='bg-black text-white hover:bg-gray-800 active:bg-gray-900 px-6 py-3 text-lg min-w-[180px] rounded-lg'
        >
          상품 삭제 열기
        </Button>
        <Modal
          open={isDeleteProductOpen}
          onClose={() => setIsDeleteProductOpen(false)}
          title='상품 삭제'
          description={[
            '코카콜라 상품을 삭제할까요?',
            '상품 삭제 후에는 복구할 수 없어요!',
          ]}
          confirmText='삭제할래요'
          cancelText='더 생각해볼게요'
          imageSrc='/img/modal/important-md.svg'
          onConfirm={() => setIsDeleteProductOpen(false)}
        />

        {/* 계정 탈퇴 모달 (유저 이메일 적용) */}
        <Button
          onClick={() => setIsDeleteAccountOpen(true)}
          className='bg-black text-white hover:bg-gray-800 active:bg-gray-900 px-6 py-3 text-lg min-w-[180px] rounded-lg'
        >
          계정 탈퇴 열기
        </Button>
        <Modal
          open={isDeleteAccountOpen}
          onClose={() => setIsDeleteAccountOpen(false)}
          title='계정 탈퇴'
          description={`${userEmail}님의 계정을 탈퇴시킬까요?`}
          confirmText='탈퇴시키기'
          cancelText='더 생각해볼게요'
          imageSrc='/img/modal/important-md.svg'
          onConfirm={() => setIsDeleteAccountOpen(false)}
        />

        {/* 승인 완료 모달 */}
        <Button
          onClick={() => setIsApprovalCompleteOpen(true)}
          className='bg-black text-white hover:bg-gray-800 active:bg-gray-900 px-6 py-3 text-lg min-w-[180px] rounded-lg'
        >
          승인 완료 열기
        </Button>
        <Modal
          open={isApprovalCompleteOpen}
          onClose={() => setIsApprovalCompleteOpen(false)}
          title='승인 완료'
          description={[
            '승인이 완료되었어요!',
            '구매 내역을 통해 배송현황을 확인해보세요',
          ]}
          confirmText='구매 내역 보기'
          cancelText='홈으로'
          imageSrc='/img/modal/approved-md.svg'
          onConfirm={() => setIsApprovalCompleteOpen(false)}
        />

        {/* 요청 반려 모달 */}
        <Button
          onClick={() => setIsRejectRequestOpen(true)}
          className='bg-black text-white hover:bg-gray-800 active:bg-gray-900 px-6 py-3 text-lg min-w-[180px] rounded-lg'
        >
          요청 반려 열기
        </Button>
        <Modal
          open={isRejectRequestOpen}
          onClose={() => setIsRejectRequestOpen(false)}
          title='요청 반려'
          description={[
            '요청이 반려되었어요',
            '목록에서 다른 요청을 확인해보세요',
          ]}
          confirmText='구매 요청 목록'
          cancelText='홈으로'
          imageSrc='/img/modal/rejected-md.svg'
          onConfirm={() => setIsRejectRequestOpen(false)}
        />
      </div>
      <h1 className='text-2xl font-bold mt-12 mb-4'>FormModal 테스트 페이지</h1>
      <div className='flex flex-col space-y-4'>
        {/* BaseFormModal 테스트 버튼 */}
        <Button
          onClick={() => setIsBaseFormOpen(true)}
          className='bg-black text-white hover:bg-gray-800 active:bg-gray-900 px-6 py-3 text-lg min-w-[180px] rounded-lg'
        >
          BaseFormModal 테스트 열기
        </Button>
        {/* BaseFormModal 적용 */}
        <BaseFormModal
          title='테스트 모달'
          description='이것은 BaseFormModal 테스트입니다.'
          isOpen={isBaseFormOpen}
          onClose={() => setIsBaseFormOpen(false)}
          onConfirm={() => alert('확인 버튼 클릭!')}
          confirmText='확인'
          cancelText='취소'
          confirmDisabled={isConfirmDisabled}
        >
          {/* 공통 Input 적용 */}
          <Input
            placeholder='이름을 입력하세요'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* 공통 TextArea 적용 */}
          <Textarea
            placeholder='설명을 입력하세요'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </BaseFormModal>
        {/* 회원 초대 버튼 */}
        <Button
          onClick={() => setIsInviteModalOpen(true)}
          className='bg-black text-white hover:bg-gray-800 active:bg-gray-900 px-6 py-3 text-lg min-w-[180px] rounded-lg'
        >
          회원 초대하기 열기
        </Button>
        {/* 초대 모달 */}
        <InviteMemberModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onConfirm={handleInviteConfirm}
        />
        {/* 회원 권한 변경 버튼 */}
        <Button
          onClick={() => setIsMemberRoleModalOpen(true)}
          className='bg-black text-white hover:bg-gray-800 px-6 py-3 text-lg min-w-[180px] rounded-lg'
        >
          회원 권한 변경 열기
        </Button>
        {/* 회원 권한 변경 모달 */}
        <MemberRoleChangeModal
          isOpen={isMemberRoleModalOpen}
          onClose={() => setIsMemberRoleModalOpen(false)}
          onConfirm={handleRoleChangeConfirm}
          member={selectedMember}
        />
        {/* 상품 등록 버튼 */}
        <Button
          onClick={() => setIsProductModalOpen(true)}
          className='bg-black text-white hover:bg-gray-800 px-6 py-3 text-lg min-w-[180px] rounded-lg'
        >
          상품 등록 열기
        </Button>
        {/* 상품 등록 모달 추가 */}
        <ProductFormModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onConfirm={handleProductConfirm}
        />

        {/* 상품 수정 모달 열기 버튼 */}
        <Button
          onClick={() => setIsEditModalOpen(true)}
          className='bg-black text-white hover:bg-gray-800 px-6 py-3 text-lg min-w-[180px] rounded-lg'
        >
          상품 수정 모달 열기
        </Button>

        {/* 상품 수정 모달 */}
        <ProductEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
          product={testProduct}
        />

        {/* 구매 요청 모달 테스트 버튼 */}
        <Button
          onClick={() => setIsPurchaseModalOpen(true)}
          className='bg-black text-white hover:bg-gray-800 px-6 py-3 text-lg min-w-[180px] rounded-lg'
        >
          구매 요청 모달 열기
        </Button>

        {/* 구매 요청 모달 */}
        <PurchaseRequestModal
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          onConfirm={handlePurchaseRequest} // 구매 요청 버튼 클릭 시 동작
          {...testPurchaseData} // 테스트 데이터 전달
        />
      </div>
    </div>
  );
}
