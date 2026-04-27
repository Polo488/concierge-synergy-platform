import { cn } from '@/lib/utils';

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export function ToggleIOS({ checked, onChange, label, className, disabled, id }: Props) {
  const inner = (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      data-state={checked ? 'checked' : 'unchecked'}
      className={cn('ios-toggle', disabled && 'opacity-50 cursor-not-allowed')}
    >
      <span className="ios-toggle-thumb" />
    </button>
  );

  if (!label) return <div className={className}>{inner}</div>;

  return (
    <label
      htmlFor={id}
      className={cn('inline-flex items-center gap-3 cursor-pointer select-none', className)}
    >
      {inner}
      <span className="text-[15px] font-medium text-[hsl(var(--label-1))]">{label}</span>
    </label>
  );
}
