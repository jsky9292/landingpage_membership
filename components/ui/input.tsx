'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#333D4B] mb-1.5"
          >
            {label}
            {props.required && <span className="text-[#F04452] ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-xl border border-[#D1D6DB] bg-white',
            'text-[#191F28] placeholder:text-[#8B95A1]',
            'focus:outline-none focus:ring-2 focus:ring-[#0064FF] focus:border-transparent',
            'disabled:bg-[#F2F4F6] disabled:cursor-not-allowed',
            'transition-all duration-200',
            error && 'border-[#F04452] focus:ring-[#F04452]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[#F04452]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-[#8B95A1]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
