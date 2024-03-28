import { clsx } from 'clsx';
import css from './PopupButton.module.scss';
import { Icon } from '@/components/icons/Icon.tsx';
import { setIsPopupOpen } from '@/stores/popupStore.ts';

interface PopupButtonProps {
  className?: string;
}

export const PopupButton = ({ className }: PopupButtonProps) => (
  <button
    className={clsx(css.button, className)}
    type="button"
    onClick={() => setIsPopupOpen(true)}
  >
    <Icon className={css.icon} id="popup-button" />
  </button>
);
