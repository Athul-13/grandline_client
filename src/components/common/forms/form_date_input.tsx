import { type InputHTMLAttributes } from 'react';
import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { cn } from '../../../utils/cn';

interface FormDateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className' | 'value' | 'onChange'> {
  label: string;
  value?: string; // ISO date string or YYYY-MM-DD format
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Keep same interface for compatibility
  error?: string;
  className?: string;
  hint?: string;
  min?: string; // YYYY-MM-DD format (for compatibility, but we'll use disabledDate instead)
}

export const FormDateInput = ({
  label,
  id,
  error,
  className,
  hint,
  disabled,
  value,
  onChange,
}: FormDateInputProps) => {
  const inputId = id || `date-${label.toLowerCase().replace(/\s+/g, '-')}`;

  // Convert value to dayjs object
  const dayjsValue = value ? dayjs(value) : null;

  // Disable past dates
  const disabledDate = (current: Dayjs | null) => {
    if (!current) return false;
    const today = dayjs().startOf('day');
    return current.isBefore(today);
  };

  const handleChange = (date: Dayjs | null) => {
    if (!onChange) return;
    
    // Convert dayjs to YYYY-MM-DD format and create a synthetic event
    const dateValue = date ? date.format('YYYY-MM-DD') : '';
    const syntheticEvent = {
      target: { value: dateValue },
      currentTarget: { value: dateValue },
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
        >
          {label}
        </label>
      )}
      <DatePicker
        id={inputId}
        value={dayjsValue}
        onChange={handleChange}
        disabled={disabled}
        disabledDate={disabledDate}
        format="YYYY-MM-DD"
        className={cn(
          'w-full',
          error && 'ant-picker-error',
          className
        )}
        style={{
          width: '100%',
          height: '48px',
        }}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</p>
      )}
    </div>
  );
};

