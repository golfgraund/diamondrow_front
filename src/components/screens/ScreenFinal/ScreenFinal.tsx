import { useEffect, useState } from 'react';
import axios from 'axios';
import { clsx } from 'clsx';
import { useStore } from 'effector-react';
import css from './ScreenFinal.module.scss';
import { AppRoute } from '@/app-routes.ts';
import { Header } from '@/components/header/Header.tsx';
import { BackButton } from '@/components/ui/buttons/BackButton/BackButton.tsx';
import { PrimaryButton } from '@/components/ui/buttons/PrimaryButton/PrimaryButton.tsx';
import { SecondaryButton } from '@/components/ui/buttons/SecondaryButton/SecondaryButton.tsx';
import { $userStore } from '@/stores/userStore';

export const ScreenFinal = () => {
  const [pdfReady, setPdfReady] = useState(false);
  const userData = useStore($userStore);
  const slug = localStorage.getItem('slug');
  const pdfStatus = localStorage.getItem('pdfStatus');
  const attemptsLeft = localStorage.getItem('attempts');

  useEffect(() => {
    window.scrollTo({ top: -999 });
  }, []);

  useEffect(() => {
    if (pdfStatus === '1') {
      setPdfReady(true);

      return;
    }

    const pdfInt = setInterval(() => {
      axios
        .get(`${import.meta.env.VITE_APP_URL_PDF_STATUS}/${slug}`)
        .then((resp) => {
          console.debug(resp.status);
          if (resp.status === 200) {
            setPdfReady(true);
            localStorage.setItem('pdfStatus', '1');
            clearInterval(pdfInt);
          }
        })
        .catch((e) => console.debug(e));
    }, 3000);

    return () => {
      clearInterval(pdfInt);
    };
  }, [slug, pdfStatus]);

  return (
    <section className={css.section}>
      <Header className={css.header} />
      <div className={clsx(css.wrapper, 'wrapper')}>
        <BackButton className={css.backButton} path={AppRoute.StepEmail}>
          <span>Назад</span>
        </BackButton>
        <div className={css.content}>
          {userData.email && (
            <div className={clsx(css.block, css.blockBlue)}>
              <p className={clsx(css.text, 'text-l', 'fw-bold')}>
                Инструкция отправлена на почту{' '}
                <a href={`mailto:${userData.email}`}>{userData.email}</a>
              </p>
            </div>
          )}
          <div className={css.block}>
            <p className={clsx(css.text, 'text-l', 'fw-medium')}>
              Вы можете начать собирать мозаику прямо сейчас на нашем сайте по интерактивной
              инструкции:
            </p>
            <PrimaryButton
              navLink={`/constructor/${slug}`}
              className={css.button}
              text="Начать сборку"
            />
          </div>
          <div className={css.block}>
            <p className={clsx(css.text, 'text-l', 'fw-medium')}>
              Или скачать PDF-файл, его можно будет открыть на любом устройстве или распечатать:
            </p>
            <PrimaryButton
              className={css.button}
              text={pdfReady ? 'Скачать инструкцию в PDF' : 'Генерация...'}
              icon={pdfReady ? 'pdf' : undefined}
              disabled={!pdfReady}
              href={`${import.meta.env.VITE_APP_URL_PDF}/${slug}.pdf`}
            />
          </div>
          {attemptsLeft && (
            <div className={css.block}>
              <p className={clsx(css.text, 'text-m', 'fw-bold')}>
                {` Код набора можно использовать еще ${attemptsLeft} раз(а), после этого он станет неактивным`}
              </p>
              <p className={clsx(css.text, 'text-m', 'fw-light')}>
                Используйте код повторно, если захотите сделать мозаику из другого фото, или
                инструкцию нужно будет отправить на другую электронную почту.
              </p>
              <SecondaryButton
                navLink={AppRoute.StepCode}
                className={clsx(css.button, css.buttonAgain)}
                text="Попробовать ещё раз"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
