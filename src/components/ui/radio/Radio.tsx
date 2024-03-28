import { clsx } from 'clsx';
import css from './Radio.module.scss';

interface RadioProps {
  className?: string;
  label?: string;
  name: string;
  items: { label?: string; value: any; img?: string }[];
  img?: string;
  disabled?: boolean;
  onChange: (e: any) => void;
  // active: boolean;
  defaultValue: any;
  active: any;
}

export const Radio = ({
  className,
  label,
  name,
  items,
  onChange,
  disabled,
  active,
}: RadioProps) => (
  <fieldset className={clsx(css.radio, className)}>
    {label && <span className={css.label}>{label}</span>}

    {items.map((item) => {
      const itemLabel = item.label && <span className={css.label}>{item.label}</span>;

      return (
        <label
          key={`radioitem-${item.value}`}
          className={clsx(css.item, item.img && css.withImage)}
        >
          {item.img && (
            <span className={css.image}>
              <img src={item.img} alt="" />
            </span>
          )}
          <input
            className="visually-hidden"
            type="radio"
            name={name}
            disabled={disabled}
            checked={Number(active) === item.value}
            value={item.value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
          <span className={css.circle} />
          {itemLabel}
        </label>
      );
    })}
  </fieldset>
);
