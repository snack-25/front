import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface BaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmDisabled?: boolean;
  children: React.ReactNode;
  showCloseButton?: boolean; // X 버튼 표시 여부 추가
}

const BaseFormModal: React.FC<BaseFormModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  confirmDisabled = false,
  children,
  showCloseButton = false, // 기본값 false
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent
        showCloseButton={showCloseButton} // ✅ X 버튼 여부 전달
        className='
          flex flex-col p-6 md:p-[32px_24px_40px] gap-6 md:gap-14 
          w-[375px] h-[500px] md:w-[688px] md:h-[664px] 
          bg-[#FBF8F4] shadow-lg rounded-3xl'
      >
        {/* 모달 헤더 */}
        <DialogHeader className='w-full text-left border-b border-[#E5E5E5] pb-2'>
          <DialogTitle className='text-[20px] md:text-[24px] font-bold'>
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className='text-gray-600'>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* 입력 필드 */}
        <div className='flex flex-col gap-4 md:gap-8 w-[327px] md:w-[640px]'>
          {children}
        </div>

        {/* 버튼 컨테이너 */}
        <div className='flex flex-row justify-between gap-4 w-[327px] md:w-[640px]'>
          <Button
            className='w-[158px] h-[54px] md:w-[310px] md:h-[64px] bg-[#FDF0DF] text-[#F97B22] rounded-lg'
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            className='w-[158px] h-[54px] md:w-[310px] md:h-[64px] bg-[#F97B22] text-white rounded-lg'
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BaseFormModal;
