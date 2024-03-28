import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useStore } from 'effector-react';
import css from './Popup.module.scss';
import { Icon } from '@/components/icons/Icon.tsx';
import { $popupStore, setIsPopupOpen } from '@/stores/popupStore.ts';

export const Popup = () => {
  const popupIsOpen = useStore($popupStore);
  const [active, setActive] = useState(false);

  const onEscKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      setIsPopupOpen(false);
    }
  };

  useEffect(() => {
    document.documentElement.addEventListener('keydown', onEscKeyDown);

    return () => document.documentElement.removeEventListener('keydown', onEscKeyDown);
  }, []);

  useEffect(() => {
    setActive(popupIsOpen);
  }, [popupIsOpen]);

  return (
    <div className={clsx(css.popup, active && css.active)}>
      <div className={css.popup__background} onClick={() => setIsPopupOpen(false)} />
      <div className={clsx(css.popup__wrapper, 'wrapper')}>
        <div className={css.popup__cross} onClick={() => setIsPopupOpen(false)} />
        <div className={css.popup__content}>
          <div className={css.popup__titles}>
            <h2>Возникли вопросы?</h2>
            <h2>Напишите нам:</h2>
          </div>
          <p className={clsx(css.text, 'text-l', 'fw-light')}>
            <a
              href={`mailto:${import.meta.env.VITE_APP_CONTACT_EMAIL}`}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noreferrer"
            >
              {import.meta.env.VITE_APP_CONTACT_EMAIL}
            </a>
          </p>
          <p className={clsx(css.text, 'text-l', 'fw-light')}>
            <a
              href={`tel:${import.meta.env.VITE_APP_CONTACT_MOBILE}`}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noreferrer"
            >
              {import.meta.env.VITE_APP_CONTACT_MOBILE}
            </a>
          </p>
          <div className={css.social}>
            <a
              className={css.social__item}
              href={`${import.meta.env.VITE_APP_CONTACT_TG}`}
              target="_blank"
              rel="noreferrer"
            >
              <Icon className={css.social__icon} id="popup-telegram" />
            </a>
            <a
              className={css.social__item}
              href={`${import.meta.env.VITE_APP_CONTACT_VI}`}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noreferrer"
            >
              <Icon className={css.social__icon} id="popup-viber" />
            </a>
            <a
              className={css.social__item}
              href={`${import.meta.env.VITE_APP_CONTACT_WA}`}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noreferrer"
            >
              <Icon className={css.social__icon} id="popup-whatsapp" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
