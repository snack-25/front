import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "rounded-[16px] h-[54px] tb:h-[64px] text-[16px] tb:text-[20px] font-[600] inline-flex items-center justify-center gap-2 ",
  {
    variants: {
      filled: {
        gray: "bg-[#E0E0E0] text-white hover:bg-gray-400",
        orange: "bg-[#F97B22] text-white hover:bg-orange-500",
        light: "bg-[#FDF0DF] text-[#F97B22] hover:bg-orange-100",
        textgray:
          "bg-[#EFEFEF] rounded-[16px] text-[#999999] hover:bg-gray-400 hover:text-white",
      },
      outlined: {
        none: "",
        gray: "border border-[#E0E0E0] bg-transparent text-[#E0E0E0] pointer-events-none",
        orange:
          "border border-[#F97B22] bg-transparent text-[#F97B22] hover:bg-orange-100",
        light:
          "border border-[#F97B22] bg-[#FBF8F4] text-[#F97B22] hover:bg-orange-50",
      },
    },
    defaultVariants: {
      filled: "gray",
      outlined: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  filled?: "gray" | "orange" | "light" | "textgray";
  outlined?: "gray" | "orange" | "light" | "none";
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
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
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
          className
        )}
        onClick={onClick}
        ref={ref}
        {...props}
        style={width ? { width } : undefined}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
