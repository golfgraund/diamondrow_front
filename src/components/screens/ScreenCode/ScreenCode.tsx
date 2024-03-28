import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';
import { StepTitle } from '@/components/shared/StepTitle/StepTitle.tsx';
import css from './ScreenCode.module.scss';
import { AppRoute } from '@/app-routes.ts';
import { Header } from '@/components/header/Header.tsx';
import { BackButton } from '@/components/ui/buttons/BackButton/BackButton.tsx';
import { PrimaryButton } from '@/components/ui/buttons/PrimaryButton/PrimaryButton.tsx';
import { Input } from '@/components/ui/input/Input.tsx';
import { FilterManager } from '@/mosaic/FilterManager';
import { $cropImageStore, setCropImageStore } from '@/mosaic/ImageStore';
import { ColorSet, ImageSize } from '@/pixelation/PixelationTypes.ts';
import { $setStepType, StepTypes } from '@/stores/stepTypeStore';
import { $setUserStore, $userStore } from '@/stores/userStore';

const CODE_REGEX = /^[0-9A-Z]{3}-[0-9A-Z]{3}-[0-9A-Z]{3}$/gim;

const maskText = (value: string) => {
  const raw = value.toUpperCase().replace(/[^0-9A-Z]+/gim, '');
  const parts: string[] = [];
  for (let i = 0; i < 9; i += 3) {
    parts.push(raw.slice(i, i + 3));
  }

  return parts.filter((p) => p.length > 0).join('-');
};

export const ScreenCode = () => {
  const [value, setValue] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();
  const userStore = useStore($userStore);
  const imageStore = useStore($cropImageStore);

  useEffect(() => {
    window.scrollTo({ top: -999 });
  }, []);
  //
  // const mask = (str: string, e: ChangeEvent<HTMLInputElement>) => {
  //   const val = str.split('');
  //   const actualLength = val.filter((el) => el !== '-').length;
  //
  //   if (
  //     actualLength % 3 === 0 &&
  //     actualLength !== 9 &&
  //     val[val.length - 1] !== '-' &&
  //     // @ts-ignore
  //     e.nativeEvent.inputType === 'insertText'
  //   ) {
  //     val.push('-');
  //   }
  //
  //   return val.join('');
  // };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;

    setValue(maskText(text));
    setErrorMessage('');
  };

  // useEffect(() => {
  // setDisabled(value.length !== 11);
  // }, []);

  useEffect(() => {
    setDisabled(!CODE_REGEX.test(value));
  }, [value]);

  const checkCode = () => {
    const data = new FormData();

    data.append('code', value);
    axios
      .post(
        `${import.meta.env.VITE_APP_URL_CODE}` || 'http://localhost:3000/api/puzzle-codes/verify',
        data,
      )
      .then((res) => {
        const { color, size } = res.data;
        let colorSet = ColorSet.BlackAndWhite;
        let aspect = 2 / 3;
        let iSize = ImageSize.Medium;

        if (color) {
          switch (color) {
            case 'sepia':
              colorSet = ColorSet.Sepia;
              break;
            case 'popArt':
              colorSet = ColorSet.PopArt;
              break;
            case 'blackAndWhite':
              colorSet = ColorSet.BlackAndWhite;
          }
        }

        if (size) {
          switch (size) {
            case '20x30':
              aspect = 2 / 3;
              iSize = ImageSize.Small;
              break;
            case '30x40':
              aspect = 3 / 4;
              iSize = ImageSize.Medium;
              break;
            case '40x50':
              aspect = 4 / 5;
              iSize = ImageSize.Large;
              break;
          }
        }

        if (color && size) {
          navigate(AppRoute.StepUploadPhoto);

          $setStepType(StepTypes.Generate);
          $setUserStore({
            ...userStore,
            code: value,
          });

          localStorage.setItem('code', value);
          localStorage.setItem('size', iSize.toString());
          localStorage.setItem('color', colorSet.toString());
          window.localStorage.setItem('way', StepTypes.Generate.toString());

          FilterManager.setImageSize(+iSize);
          FilterManager.setColorSet(colorSet);
          setCropImageStore({ ...imageStore, aspect, colorSet });
        } else {
          // navigate(AppRoute.StepColorSize);
        }
      })
      .catch((e) => {
        setErrorMessage(e.response.data.response.code[0]);
        setDisabled(true);
      });
  };

  return (
    <section className={css.section}>
      <Header className={css.header} />
      <div className={clsx(css.wrapper, 'wrapper')}>
        <BackButton className={css.backButton} path={AppRoute.Main}>
          <span>Назад</span>
        </BackButton>
        <div className={css.content}>
          <StepTitle className={css.step} step={1} text="Введите код набора" />
          <Input
            className={css.input}
            placeholder="000-000-000"
            value={value}
            onChange={onChange}
            max={11}
            error={errorMessage}
          />
          <ul className={clsx(css.list, 'list')}>
            <li>Один код можно использовать 5 раз.</li>
            <li>
              Попытка засчитается после того, как инструкция для создания мозаики придёт вам на
              электронную почту.
            </li>
            <li>
              Если ваш код содержит символы “0” или “О” и при вводе выдается ошибка, то попробуйте
              заменить “0” на “О” и наоборот.
            </li>
          </ul>
          <PrimaryButton
            className={css.button}
            text="Далее"
            disabled={disabled}
            handler={checkCode}
          />
        </div>
      </div>
    </section>
  );
};
