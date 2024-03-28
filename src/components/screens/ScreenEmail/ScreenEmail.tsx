import { useEffect, useState } from 'react';
import axios from 'axios';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';
import { StepTitle } from '@/components/shared/StepTitle/StepTitle.tsx';
import css from './ScreenEmail.module.scss';
import { AppRoute } from '@/app-routes';
import { Header } from '@/components/header/Header.tsx';
import { BackButton } from '@/components/ui/buttons/BackButton/BackButton.tsx';
import { PrimaryButton } from '@/components/ui/buttons/PrimaryButton/PrimaryButton.tsx';
import { Input } from '@/components/ui/input/Input.tsx';
import { $setUserStore, $userStore } from '@/stores/userStore';

export const ScreenEmail = () => {
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [valid, setValid] = useState<boolean>(false);
  const navigate = useNavigate();
  const userStore = useStore($userStore);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  useEffect(() => {
    window.scrollTo({ top: -999 });

    if (userStore.matrix_progress.length === 0) {
      navigate(AppRoute.StepUploadPhoto);
    }
  }, [navigate, userStore]);

  const submit = () => {
    if (isSubmitted) {
      return;
    }

    setValid(reg.test(email));

    if (valid) {
      $setUserStore({
        ...userStore,
        email,
      });

      const data = new FormData();

      data.append('email', email);
      data.append('code', userStore.code);
      data.append('preview_picture_type', 'tall');
      data.append('matrix_progress', JSON.stringify(userStore.matrix_progress));
      data.append('preview_picture', userStore.picture_file!);
      data.append('picture_colors', userStore.colorSet_File!);

      setIsSubmitted(true);

      axios
        .post(`${import.meta.env.VITE_APP_URL_MOSAIC}` || 'http://localhost:3000/api/puzzle', data)
        .then((res) => {
          console.debug(res.data);
          localStorage.setItem('slug', res.data.slug);
          localStorage.setItem('pdfStatus', '0');
          localStorage.setItem('attempts', res.data.attempts_counter);
          navigate(AppRoute.StepFinal);
        })
        .catch(() => {
          setIsSubmitted(false);
        });
    } else {
      setErrorMessage('Указан неверный адрес');
    }
  };

  return (
    <section className={css.section}>
      <Header className={css.header} />
      <div className={clsx(css.wrapper, 'wrapper')}>
        <BackButton className={css.backButton} path={AppRoute.StepFilters}>
          <span>Назад</span>
        </BackButton>
        <div className={css.content}>
          <div className={css.block}>
            <StepTitle className={css.step} step={4} text="Введите электронную почту" />
            <p className={css.label}>Мы пришлём на неё вашу инструкцию</p>
            <Input
              className={css.input}
              type="email"
              placeholder="Ваша почта"
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage('');
                setValid(reg.test(e.target.value));
              }}
              error={errorMessage}
            />
            <PrimaryButton className={css.button} text="Далее" handler={submit} disabled={!valid} />
          </div>
        </div>
      </div>
    </section>
  );
};
