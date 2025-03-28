// components/ui/SimpleToast.tsx
'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CircleCheck, CircleX, icons, X } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';

export interface IProps {
  id: string | number;
  label: string;
  variant?: 'success' | 'error';
  onClick?: () => void;
}

const shakeVariants = {
  hidden: { x: 0 },
  visible: {
    x: [0, -10, 10, -10, 10, -5, 5, 0],
    transition: { duration: 0.6 },
  },
};

export function useCustomToast({
  label,
  variant,
  onClick,
}: Omit<IProps, 'id'>) {
  return sonnerToast.custom((id) => (
    <CustomToast
      id={id}
      label={label}
      variant={variant}
      onClick={onClick}
    />
  ));
}

export function CustomToast({ id, label, variant, onClick }: IProps) {
  const textColor = variant === 'error' ? 'text-red-500' : 'text-primary-400';
  const iconSize = 'w-6 h-6';

  return (
    <motion.div
      variants={variant === 'error' ? shakeVariants : {}}
      initial={variant === 'error' ? 'hidden' : undefined}
      animate={variant === 'error' ? 'visible' : undefined}
      className='flex rounded-lg bg-background-500 -translate-x-1/5 shadow-lg ring-1 h-16 ring-black/5 w-[524px] items-center px-[30px] '
    >
      <div className='w-full flex items-center justify-between'>
        <div className='flex gap-3 items-center'>
          {variant === 'error' ? (
            <CircleX className={cn(textColor, iconSize)} />
          ) : (
            <CircleCheck
              className={cn(iconSize, 'text-white fill-primary-400')}
            />
          )}
          <p className={cn(textColor, 'text-lg font-medium')}>{label}</p>
        </div>
        <button onClick={() => sonnerToast.dismiss(id)}>
          <X
            className={cn(textColor, iconSize)}
            onClick={onClick}
          />
        </button>
      </div>
    </motion.div>
  );
}
