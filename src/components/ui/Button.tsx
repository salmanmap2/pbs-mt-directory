import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', fullWidth, className = '', ...props }: Props) {
  const base = 'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors min-h-[44px]';
  const variants = {
    primary: 'bg-accent-blue hover:bg-blue-700 text-white',
    secondary: 'bg-bg-elevated hover:bg-bg-card text-text-primary border border-border',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'hover:bg-bg-elevated text-text-secondary',
  };
  return <button className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props} />;
}
