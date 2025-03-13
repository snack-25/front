import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 inline-flex  whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      filled: {
        gray: 'rounded-[16px] h-[54px] tb:h-[64px] text-[16px] tb:text-[20px] font-[600] bg-[#E0E0E0] text-white hover:bg-gray-400',
        orange:
          'rounded-[16px] h-[54px] tb:h-[64px] text-[16px] tb:text-[20px] font-[600] bg-[#F97B22] text-white hover:bg-orange-500',
        light:
          'rounded-[16px] h-[54px] tb:h-[64px] text-[16px] tb:text-[20px] font-[600] bg-[#FDF0DF] text-[#F97B22] hover:bg-orange-100',
        textgray:
          'rounded-[16px] h-[54px] tb:h-[64px] text-[16px] tb:text-[20px] font-[600] bg-[#EFEFEF] rounded-[16px] text-[#999999] hover:bg-gray-400 hover:text-white',
      },
      outlined: {
        gray: 'rounded-[16px] h-[54px] tb:h-[64px] text-[16px] tb:text-[20px] font-[600] border border-[#E0E0E0] bg-transparent text-[#E0E0E0] pointer-events-none',
        orange:
          'rounded-[16px] h-[54px] tb:h-[64px] text-[16px] tb:text-[20px] font-[600] border border-[#F97B22] bg-transparent text-[#F97B22] hover:bg-orange-100',
        light:
          'rounded-[16px] h-[54px] tb:h-[64px] text-[16px] tb:text-[20px] font-[600] border border-[#F97B22] bg-[#FBF8F4] text-[#F97B22] hover:bg-orange-50',
      },
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  rounded?: string;
  height?: string;
  font?: string;
  width?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      onClick,
      className,
      filled,
      outlined,
      height,
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
          }),
          font,
          height,
          rounded,
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
