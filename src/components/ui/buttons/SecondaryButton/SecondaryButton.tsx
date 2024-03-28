import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import css from './SecondaryButton.module.scss';
import { Icon, IconId } from '@/components/icons/Icon.tsx';

interface SecondaryButtonProps {
  className?: string;
  handler?: () => void;
  navLink?: string;
  disabled?: boolean;
  text?: string;
  icon?: IconId;
  small?: boolean;
}

export const SecondaryButton = ({
  className,
  handler,
  disabled,
  navLink,
  text,
  icon,
  small = false,
}: SecondaryButtonProps) => {
  if (navLink) {
    return (
      <NavLink
        to={navLink}
        className={clsx(
          className,
          css.button,
          disabled && css.disabled,
          icon && css.withIcon,
          css[`${icon}`],
          text && css.withText,
          small && css.small,
        )}
      >
        {text && <span className={css.text}>{text}</span>}
        {icon && (
          <span className={css.icon}>
            <Icon id={icon} />
          </span>
        )}
      </NavLink>
    );
  }

  return (
    <button
      className={clsx(
        className,
        css.button,
        disabled && css.disabled,
        icon && css.withIcon,
        css[`${icon}`],
        text && css.withText,
        small && css.small,
      )}
      onClick={handler}
    >
      {text && <span className={css.text}>{text}</span>}
      {icon && (
        <span className={css.icon}>
          <Icon id={icon} />
        </span>
      )}
    </button>
  );
};
