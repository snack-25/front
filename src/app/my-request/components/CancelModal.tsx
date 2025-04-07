// components/CancelModal.tsx
'use client';

import { useEffect } from 'react';
import Image from 'next/image';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  count: number;
}

const CancelModal = ({ open, onClose, onConfirm, itemName, count }: Props) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-[460px] p-8 text-center relative">
      <div className="flex justify-center mb-4">
      <Image
        src="/img/modal/important-md.svg" 
        alt="경고 아이콘"
        width={221} // 사이즈 조절 가능
        height={113}
      />
      </div>
        <h2 className="text-xl font-bold mb-2">구매 요청 취소</h2>
        <p className="mb-1">
          <strong>{itemName}</strong> 외 <strong>{count}건</strong> 구매 요청을 취소하시겠어요?
        </p>
        <p className="text-gray-400 text-sm mb-6">구매 요청 취소 후에는 복구할 수 없어요!</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="flex-1 h-[50px] bg-[#FFF1E8] text-orange-400 rounded-md font-semibold transition-transform duration-200 hover:scale-105 cursor-pointer"
          >
            더 생각해볼게요
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-[50px] bg-orange-400 text-white rounded-md font-semibold transition-transform duration-200 hover:scale-105 hover:bg-orange-500 cursor-pointer"
          >
            취소할래요
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
