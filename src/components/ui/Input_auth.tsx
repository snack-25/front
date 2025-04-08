import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { useState } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

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
  iconPosition?: 'left' | 'right';
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
      value,
      iconPosition,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // 포커스 시 상태 업데이트
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e); // 기존 onFocus 콜백 호출
    };

    // 포커스 아웃 시 상태 업데이트
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e); // 기존 onBlur 콜백 호출
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
            disabled
              ? 'border-[#d1d1d1] bg-[#FBF8F4] text-[#999999] cursor-not-allowed opacity-50' // ✅ disabled일 때 border 색상 지정
              : 'border-[#FCC49C]', // ✅ 기본 border 색 유지
          )}
        >
          {/* 왼쪽 아이콘 (검색 등) */}
          {iconPosition === 'left' && children && (
            <div className='mr-2 flex-shrink-0'>{children}</div>
          )}
          <input
            type={type}
            className={cn(
              'w-full focus:outline-none placeholder-[var(--color-gray-500)] bg-[transparent] text-[14px] tb:text-[18px] pr-10',
              // 포커스 상태일 때 텍스트 색상
              isFocused || value ? 'text-black' : '', // 포커스가 있을 때 검정색
              // 수정된 값이 있을 때 텍스트 색상
              isModified ? 'text-black' : 'text-[#999999]', // 수정된 값은 검정색, 기본값은 회색
              className,
              titleClassName,
            )}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            // onFocus={onFocus}
            // onBlur={onBlur}
            ref={ref}
            disabled={disabled} // ✅ 기본 disabled 속성 그대로 사용
            value={value}
            {...props}
          />
          {/* 오른쪽 아이콘 (기본) */}
          {(!iconPosition || iconPosition === 'right') && children && (
            <div className='ml-2 flex-shrink-0'>{children}</div>
          )}
        </div>
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
