import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// ✅ containerVariants에서 disabled 제거 (기본 props 사용)
const containerVariants = cva(
  'focus-within:border-[#F97B22] focus-within:border-2 rounded-[16px] border border-[#FCC49C] bg-[#fff] flex w-full px-3 py-2 text-base ring-offset-background',
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
  extends Omit<React.ComponentProps<'input'>, 'height'>, // ✅ 'disabled' 제거하지 않음 (기본 제공)
    VariantProps<typeof containerVariants> {
  children?: React.ReactNode;
  titleClassName?: string;
  isModified?: boolean; // 수정된 상태를 판단하는 prop 추가
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      children,
      disabled, // ✅ 기본 HTML 속성 사용
      type,
      onChange,
      height,
      titleClassName,
      onFocus,
      onBlur,
      isModified,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // 포커스 시 상태 업데이트
    const handleFocus = () => {
      setIsFocused(true);
    };

    // 포커스 아웃 시 상태 업데이트
    const handleBlur = () => {
      setIsFocused(false);
    };
    return (
      <div className='flex flex-col relative'>
        {titleClassName && (
          <h2 className='mb-[8px] tb:mb-[16px] text-[14px] tb:text-[20px]'>
            {titleClassName}
          </h2>
        )}
        {/* ✅ disabled가 true/false일 때 스타일 자동 적용 */}
        <div
          className={cn(
            containerVariants({ height }),
            disabled &&
              'border border-[#E6E6E6] bg-[#FBF8F4] text-[#999999]cursor-not-allowed opacity-50', // ✅ 직접 처리
          )}
        >
          <input
            type={type}
            style={{
              color: isModified ? 'var(--color-black-400)' : '#A0A0A0', // 수정되면 검정색, 아니면 회색
            }}
            className={cn(
              'w-full focus:outline-none placeholder-[var(--color-gray-500)] bg-[transparent] text-[14px] tb:text-[18px] pr-10',
              isFocused || props.value ? 'text-black' : 'text-gray-400',
              className,
              titleClassName,
            )}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            ref={ref}
            disabled={disabled} // ✅ 기본 disabled 속성 그대로 사용
            {...props}
          />
          {children}
        </div>
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
