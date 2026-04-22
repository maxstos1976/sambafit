import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: 'bg-brand-green text-white hover:bg-brand-orange shadow-lg shadow-brand-green/20',
      secondary: 'bg-brand-lime text-brand-green hover:bg-brand-lime/80',
      outline: 'border-2 border-brand-green/10 text-brand-green hover:bg-brand-green/5',
      ghost: 'bg-transparent text-brand-green hover:bg-brand-green/5',
      danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20'
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-8 py-3 text-sm',
      lg: 'px-10 py-4 text-base',
      icon: 'p-2'
    };

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all rounded-full disabled:opacity-50 disabled:pointer-events-none active:scale-95',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        // @ts-ignore - motion and ref types
        ref={ref}
        {...(props as any)}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        <span className={cn(isLoading && 'opacity-0')}>{children}</span>
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
