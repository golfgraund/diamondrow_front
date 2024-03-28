import { clsx } from 'clsx';
import css from './StepTitle.module.scss';

interface StepTitleProps {
  className?: string;
  step: number;
  text: string;
}

export const StepTitle = ({ className, step, text }: StepTitleProps) => (
  <div className={clsx(css.step, className)}>
    <div className={clsx(css.step__number, 'text-l', 'fw-bold')}>{step}</div>
    <p className={clsx(css.step__description, 'text-l', 'fw-medium')}>{text}</p>
  </div>
);
