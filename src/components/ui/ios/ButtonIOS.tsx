import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'icon';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const ButtonIOS = React.forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', className, leftIcon, rightIcon, children, ...rest }, ref) => {
    const variantClass =
      variant === 'primary'
        ? 'ios-btn ios-btn-primary'
        : variant === 'secondary'
        ? 'ios-btn ios-btn-secondary'
        : variant === 'tertiary'
        ? 'ios-btn ios-btn-tertiary'
        : variant === 'destructive'
        ? 'ios-btn ios-btn-destructive'
        : 'ios-btn-icon';

    return (
      <button ref={ref} className={cn(variantClass, className)} {...rest}>
        {leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);
ButtonIOS.displayName = 'ButtonIOS';
