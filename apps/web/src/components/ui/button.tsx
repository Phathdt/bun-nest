import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-stone-950 text-white hover:bg-stone-800',
  secondary: 'border border-stone-300 bg-white text-stone-950 hover:bg-stone-100',
  ghost: 'text-stone-600 hover:bg-stone-100 hover:text-stone-950',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export function Button({
  className,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
