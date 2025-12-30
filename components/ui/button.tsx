'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-[#0064FF] text-white hover:bg-[#0052D4] focus:ring-[#0064FF]',
        secondary: 'bg-[#F2F4F6] text-[#333D4B] hover:bg-[#E5E8EB] focus:ring-[#D1D6DB]',
        outline: 'border-2 border-[#D1D6DB] text-[#333D4B] hover:bg-[#F2F4F6] focus:ring-[#D1D6DB]',
        ghost: 'text-[#4E5968] hover:bg-[#F2F4F6] focus:ring-[#D1D6DB]',
        danger: 'bg-[#F04452] text-white hover:bg-[#D93B47] focus:ring-[#F04452]',
        success: 'bg-[#00C853] text-white hover:bg-[#00B548] focus:ring-[#00C853]',
      },
      size: {
        sm: 'text-sm px-3 py-1.5 min-h-[32px]',
        md: 'text-base px-4 py-2.5 min-h-[44px]',
        lg: 'text-lg px-6 py-3 min-h-[52px]',
        xl: 'text-xl px-8 py-4 min-h-[60px]',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, fullWidth, className })}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
