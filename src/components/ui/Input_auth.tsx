import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

// base 클래스와 variant 옵션을 설정합니다.
const inputVariants = cva(
  'focus:outline-none focus:ring-2 focus:ring-[#F97B22] focus:border-none rounded-[16px] border border-[#FCC49C] bg-[#fff] flex w-full px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      height: {
        s: 'h-[52px]',
        m: 'h-[54px]',
        l: 'h-[64px]',
      },
    },
    defaultVariants: {
      height: 's',
    },
  },
);

interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'height'>,
    VariantProps<typeof inputVariants> {
  children?: React.ReactNode;
  titleClassName?: string;
  textClassName?: string;
}

// forwardRef를 사용해 ref를 전달할 수 있도록 합니다.
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      children,
      type,
      onChange,
      height,
      titleClassName,
      textClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div className='flex flex-col'>
        {/* 제목과 input 사이에 간격을 넣는 것 */}
        <div
          className={cn(
            'text-[14px] tb:text-[20px] mb-[8px] tb:mb-[10px]',
            titleClassName,
          )}
        >
          {children}
        </div>

        <input
          type={type}
          style={{ color: 'var(--color-black-400)' }}
          className={cn(
            'placeholder-[var(--color-gray-500)] text-[14px] tb:text-[18px] ',
            inputVariants({ height }),
            className,
            textClassName,
          )}
          onChange={onChange}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
