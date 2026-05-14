import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-9 w-full rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:ring-2 focus:ring-stone-200',
        className,
      )}
      {...props}
    />
  );
}
