import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      filled: {
        gray: 'bg-[#E0E0E0] text-white hover:bg-gray-400',
        orange: 'bg-[#F97B22] text-white hover:bg-orange-500',
        light: 'bg-[#FDF0DF] text-[#F97B22] hover:bg-orange-100',
        textgray:
          'bg-[#EFEFEF] rounded-[16px] text-[#999999] hover:bg-gray-400 hover:text-white',
      },
      outlined: {
        none: '',
        gray: 'border border-[#E0E0E0] bg-transparent text-[#E0E0E0] pointer-events-none',
        orange:
          'border border-[#F97B22] bg-transparent text-[#F97B22] hover:bg-orange-100',
        light:
          'border border-[#F97B22] bg-[#FBF8F4] text-[#F97B22] hover:bg-orange-50',
      },
      size: {
        default: 'h-[64px] w-full',
        xs: 'h-[34px]',
        s: 'h-[42px]',
        m: 'h-[44px]',
        l: 'h-[54px]',
        xl: 'h-[64px]',
      },
      font: {
        default: 'font-semibold text-[20px]',
        xs: 'font-semibold text-[13px]',
        s: 'font-semibold text-[16px]',
        m: 'font-semibold text-[18px]',
      },
      rounded: {
        default: 'rounded-[16px] ',
        none: 'rounded-none',
        s: 'rounded-[8px] ',
      },
    },
    defaultVariants: {
      filled: 'gray',
      outlined: 'none',
      size: 'xl',
      font: 'default',
      rounded: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  filled?: 'gray' | 'orange' | 'light' | 'textgray';
  outlined?: 'gray' | 'orange' | 'light' | 'none';
  size?: 'default' | 'xs' | 's' | 'm' | 'l' | 'xl';
  rounded?: 'default' | 'none' | 's';
  font?: 'default' | 'xs' | 's';
  width?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      onClick,
      className,
      filled,
      outlined,
      size,
      rounded,
      font,
      width,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          buttonVariants({
            filled: filled ?? undefined,
            outlined: outlined ?? undefined,
            size: size ?? undefined,
            rounded: rounded ?? undefined,
            font: font ?? undefined,
          }),
          className,
        )}
        onClick={onClick}
        ref={ref}
        {...props}
        style={width ? { width } : undefined}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
