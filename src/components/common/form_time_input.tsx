import { type InputHTMLAttributes, useMemo } from 'react';
import { TimePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { cn } from '../../utils/cn';

interface FormTimeInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className' | 'value' | 'onChange'> {
  label: string;
  value?: string; // HH:MM format
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Keep same interface for compatibility
  error?: string;
  className?: string;
  hint?: string;
  min?: string; // HH:MM format (for compatibility)
  selectedDate?: string; // ISO date string or YYYY-MM-DD format to determine if it's today
}

export const FormTimeInput = ({
  label,
  id,
  error,
  className,
  hint,
  disabled,
  value,
  onChange,
  selectedDate,
}: FormTimeInputProps) => {
  const inputId = id || `time-${label.toLowerCase().replace(/\s+/g, '-')}`;

  // Convert value to dayjs object
  const dayjsValue = useMemo(() => {
    if (!value) return null;
    const [hours, minutes] = value.split(':');
    const baseDate = selectedDate ? dayjs(selectedDate) : dayjs();
    return baseDate.hour(parseInt(hours, 10)).minute(parseInt(minutes, 10));
  }, [value, selectedDate]);

  // Disable past times and times less than 1 hour from now
  const disabledTime = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (_date: Dayjs | null) => {
      const now = dayjs();
      const oneHourLater = now.add(1, 'hour');
      const isToday = selectedDate ? dayjs(selectedDate).isSame(dayjs(), 'day') : true;

      if (!isToday) {
        // If not today, allow all times
        return {};
      }

      // If today, disable times before one hour from now
      const currentHour = now.hour();
      const minHour = oneHourLater.hour();
      const hours: number[] = [];
      
      // Disable all hours before the minimum hour
      for (let i = 0; i < minHour; i++) {
        hours.push(i);
      }
      
      // If we're in the same hour, disable minutes too
      if (currentHour === minHour) {
        const minMinute = oneHourLater.minute();
        return {
          disabledHours: () => hours,
          disabledMinutes: (selectedHour: number) => {
            if (selectedHour === minHour) {
              const minutes: number[] = [];
              for (let i = 0; i <= minMinute; i++) {
                minutes.push(i);
              }
              return minutes;
            }
            return [];
          },
        };
      }
      
      return {
        disabledHours: () => hours,
      };
    };
  }, [selectedDate]);

  const handleChange = (time: Dayjs | null) => {
    if (!onChange) return;
    
    // Convert dayjs to HH:MM format and create a synthetic event
    const timeValue = time ? time.format('HH:mm') : '';
    const syntheticEvent = {
      target: { value: timeValue },
      currentTarget: { value: timeValue },
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
      <TimePicker
        id={inputId}
        value={dayjsValue}
        onChange={handleChange}
        disabled={disabled}
        disabledTime={disabledTime}
        format="h:mm A"
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

