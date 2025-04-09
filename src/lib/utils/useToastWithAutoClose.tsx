'use client';

import { toast as sonnerToast } from 'sonner';
import { CustomToast } from '@/components/ui/Toast/Toast';
import type { IProps } from '@/components/ui/Toast/Toast';

interface ToastOptions extends Omit<IProps, 'id'> {
  duration?: number;
}

export const showToastWithAutoClose = ({
  label,
  variant,
  onClick,
  duration = 2000,
}: ToastOptions) => {
  return sonnerToast.custom(
    (id) => (
      <CustomToast
        id={id}
        label={label}
        variant={variant}
        onClick={onClick}
      />
    ),
    {
      duration,
    },
  );
};
