import type { ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

interface LabelProps {
  label: string;
  id: string;
  errors?: FieldError;
  children: ReactNode;
  labelClassName?: string;
  errorClassName?: string;
}

export default function LabelField({
  label,
  id,
  errors,
  children,
  labelClassName = 'mb-2 block font-semibold text-gray-700',
  errorClassName = 'mt-1 text-sm text-red-600',
}: LabelProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      {children}
      {errors && <p className={errorClassName}>{errors.message}</p>}
    </div>
  );
}
