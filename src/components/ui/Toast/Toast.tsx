// components/ui/SimpleToast.tsx
'use client';

import { CircleCheck, X } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';

export interface IProps {
  id: string | number;
  label: string;
}

export function useCustomToast({ label }: Omit<IProps, 'id'>) {
  return sonnerToast.custom((id) => (
    <CustomToast
      id={id}
      label={label}
    />
  ));
}

export function CustomToast({ id, label }: IProps) {
  return (
    <div className='flex rounded-lg bg-background-500 -translate-x-1/5 shadow-lg ring-1 h-16 ring-black/5 w-[524px] items-center px-[30px] '>
      <div className='w-full flex items-center justify-between'>
        <div className='flex gap-3 items-center'>
          <CircleCheck className='text-white fill-primary-400 w-6 h-6' />
          <p className='text-lg font-medium text-primary-400'>{label}</p>
        </div>
        <button onClick={() => sonnerToast.dismiss(id)}>
          <X className='w-6 h-6 text-orange-300' />
        </button>
      </div>
    </div>
  );
}
