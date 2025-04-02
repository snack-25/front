import React from 'react';

import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

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
  smallSize?: string;
  largeSize?: string;
  confirmButtonProps?: string;
  cancelButtonProps?: string;
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
  showCloseButton = false,
  smallSize = 'w-[375px] h-[456px]',
  largeSize = 'md:w-[688px] md:h-[528px]',
  confirmButtonProps = 'w-[158px] h-[54px] md:w-[310px] md:h-[64px]', 
  cancelButtonProps = 'w-[158px] h-[54px] md:w-[310px] md:h-[64px]',
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent
        showCloseButton={showCloseButton} // X 버튼 여부 전달
        className={`
          z-[9999]
          flex flex-col p-6 md:p-[32px_24px_40px] gap-4 md:gap-8
          bg-[#FBF8F4] shadow-lg rounded-3xl
          ${smallSize} ${largeSize}
        `}
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
        <div className='flex flex-col text-2lg gap-4 md:gap-8 w-[327px] md:w-[640px]'>
          {children}
        </div>

        {/* 버튼 컨테이너 */}
        <div className='grid grid-cols-2 gap-4 w-full text-2lg'>
          <Button
            className={`bg-[#FDF0DF]  text-[#F97B22] rounded-lg ${cancelButtonProps} text-2lg`}
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
  className={`rounded-lg ${confirmButtonProps} text-2lg ${
    confirmDisabled
      ? 'bg-gray-300 text-white cursor-not-allowed'
      : 'bg-[#F97B22] text-white hover:bg-orange-600 cursor-pointer'
  }`}
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
