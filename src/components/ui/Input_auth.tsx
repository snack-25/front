import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

// 컨테이너(div)에 적용할 스타일 정의
const containerVariants = cva(
  'focus-within:border-[#F97B22] focus-within:border-2 rounded-[16px] border border-[#FCC49C] bg-[#fff] flex w-full px-3 py-2 text-base ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
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
    VariantProps<typeof containerVariants> {
  children?: React.ReactNode;
  titleClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, children, type, onChange, height, titleClassName, ...props },
    ref,
  ) => {
    return (
      <div className='flex flex-col relative'>
        {titleClassName && (
          <h2 className='mb-[8px] tb:mb-[16px] text-[14px] tb:text-[20px]'>
            {titleClassName}
          </h2>
        )}
        {/* focus-within을 사용하여 내부 input이 포커스되면 부모 div에 스타일 적용 */}
        <div className={cn(containerVariants({ height }))}>
          <input
            type={type}
            style={{ color: 'var(--color-black-400)' }}
            className={cn(
              'w-full focus:outline-none placeholder-[var(--color-gray-500)] bg-[transparent] text-[14px] tb:text-[18px] pr-10',
              className,
              titleClassName,
            )}
            onChange={onChange}
            ref={ref}
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

// const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

// {showPasswordToggle && (
//   <button
//     type='button'
//     onClick={() => setIsPasswordVisible((prev) => !prev)}
//     className='absolute inset-y-0 right-3 flex items-center'
//     onMouseDown={(e) => e.preventDefault()} // 클릭 시 포커스 유지
//   >
//     {isPasswordVisible ? (
//       <Image
//         src='/icon/lined/visibility-on.svg'
//         alt='비밀번호 보이기'
//         width={20}
//         height={20}
//         unoptimized
//       />
//     ) : (
//       <Image
//         src='/icon/lined/visibility-off.svg'
//         alt='비밀번호 숨기기'
//         width={20}
//         height={20}
//         unoptimized
//       />
//     )}
//   </button>
// )}
