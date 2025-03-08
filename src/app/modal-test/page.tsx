'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';

// 유저 이메일 (실제 상황에서는 API 또는 상태에서 가져올 것)
const userEmail = '김스낵(sn@codeit.com)';

export default function ModalTestPage() {
  // 모달별 상태 (각 모달을 개별적으로 관리)
  const [isCancelRequestOpen, setIsCancelRequestOpen] = useState(false);
  const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isApprovalCompleteOpen, setIsApprovalCompleteOpen] = useState(false);
  const [isRejectRequestOpen, setIsRejectRequestOpen] = useState(false);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen space-y-6'>
      <h1 className='text-2xl font-bold mb-4'>Modal 테스트 페이지</h1>

      {/* 구매 요청 취소 모달 */}
      <Button onClick={() => setIsCancelRequestOpen(true)}>
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
      <Button onClick={() => setIsDeleteProductOpen(true)}>
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
      <Button onClick={() => setIsDeleteAccountOpen(true)}>
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
      <Button onClick={() => setIsApprovalCompleteOpen(true)}>
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
      <Button onClick={() => setIsRejectRequestOpen(true)}>
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
  );
}
