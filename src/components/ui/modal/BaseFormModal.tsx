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
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='max-w-lg p-6 rounded-lg bg-white shadow-lg'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className='space-y-4'>{children}</div>
        <div className='flex justify-end space-x-2 mt-4'>
          <Button
            className='border border-gray-300 text-gray-700 px-4 py-2 rounded'
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            className={`px-4 py-2 rounded ${
              confirmDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white'
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
