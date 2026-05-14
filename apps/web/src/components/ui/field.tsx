import type { LabelHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('grid gap-1.5 text-sm font-medium text-stone-700', className)}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export function FieldHint({ className, ...props }: LabelHTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('text-xs font-normal text-stone-500', className)} {...props} />
  );
}
