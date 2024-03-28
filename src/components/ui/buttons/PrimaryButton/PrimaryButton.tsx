import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import css from './PrimaryButton.module.scss';
import { Icon, IconId } from '@/components/icons/Icon.tsx';

interface ButtonProps {
  className?: string;
  navLink?: string;
  handler?: () => void;
  disabled?: boolean;
  text?: string;
  icon?: IconId;
  error?: string;
  href?: string;
}

export const PrimaryButton = ({
  className,
  handler,
  navLink,
  disabled,
  error,
  text,
  icon,
  href,
}: ButtonProps) => {
  if (navLink) {
    return (
      <>
        <NavLink
          to={navLink}
          className={clsx(className, css.button, disabled && css.disabled)}
          onClick={handler}
        >
          {text && <span className={css.text}>{text}</span>}
          {icon && (
            <span className={css.icon}>
              <Icon id={icon} />
            </span>
          )}
        </NavLink>
        {error && <span className={css.error}>{error}</span>}
      </>
    );
  }

  if (href) {
    return (
      <>
        <a
          href={href}
          className={clsx(className, css.button, disabled && css.disabled)}
          onClick={handler}
          target="_blank"
          rel="noreferrer"
        >
          {text && <span className={css.text}>{text}</span>}
          {icon && (
            <span className={css.icon}>
              <Icon id={icon} />
            </span>
          )}
        </a>
        {error && <span className={css.error}>{error}</span>}
      </>
    );
  }

  return (
    <>
      <button className={clsx(className, css.button, disabled && css.disabled)} onClick={handler}>
        {text && <span className={css.text}>{text}</span>}
        {icon && (
          <span className={css.icon}>
            <Icon id={icon} />
          </span>
        )}
      </button>
      {error && <span className={css.error}>{error}</span>}
    </>
  );
};
