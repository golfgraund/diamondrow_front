import { ChangeEvent } from 'react';
import { clsx } from 'clsx';
import css from './Input.module.scss';

interface InputProps {
  className?: string;
  type?: 'text' | 'number' | 'email';
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string;
  error?: string;
  disabled?: boolean;
  max?: number;
}

export const Input = ({
  className,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled,
  max,
}: InputProps) => (
  <div>
    <div className={clsx(css.wrapper, className, error && css.withError, disabled && css.disabled)}>
      <input
        className={css.input}
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={max}
        value={value}
      />
      <label className={clsx(css.label)} />
      {error && <div className={css.error}>{error}</div>}
    </div>
  </div>
);
