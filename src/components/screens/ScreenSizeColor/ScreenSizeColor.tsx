import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';
import { StepTitle } from '@/components/shared/StepTitle/StepTitle.tsx';
import css from './ScreenSizeColor.module.scss';
import { AppRoute } from '@/app-routes.ts';
import image1 from '@/assets/images/mosaic-radio/radio1@2x.png';
import image2 from '@/assets/images/mosaic-radio/radio2@2x.png';
import image3 from '@/assets/images/mosaic-radio/radio3@2x.png';
import { Header } from '@/components/header/Header.tsx';
import { BackButton } from '@/components/ui/buttons/BackButton/BackButton.tsx';
import { PrimaryButton } from '@/components/ui/buttons/PrimaryButton/PrimaryButton.tsx';
import { Radio } from '@/components/ui/radio/Radio.tsx';
import { FilterManager } from '@/mosaic/FilterManager';
import { $cropImageStore, setCropImageStore } from '@/mosaic/ImageStore';
import { ColorSet, ImageSize } from '@/pixelation/PixelationTypes.ts';
import { $previewStore, $setPreviewStore } from '@/stores/previewStore';
import { $setStepType, StepTypes } from '@/stores/stepTypeStore';

const radio1 = [
  {
    label: '20x30 см',
    value: ImageSize.Small,
  },
  {
    label: '30x40 см',
    value: ImageSize.Medium,
  },
  {
    label: '40x50 см',
    value: ImageSize.Large,
  },
];

const radio2 = [
  {
    label: 'Чёрно-белый',
    value: ColorSet.BlackAndWhite,
    img: image1,
  },
  {
    label: 'Винтаж',
    value: ColorSet.Sepia,
    img: image2,
  },
  {
    label: 'Поп-арт',
    value: ColorSet.PopArt,
    img: image3,
  },
];

export const ScreenSizeColor = () => {
  const [colorSet, setColorSet] = useState<ColorSet>(radio2[0].value);
  const [size, setSize] = useState<ImageSize>(radio1[0].value);
  const navigate = useNavigate();
  const previewStore = useStore($previewStore);
  const cropStore = useStore($cropImageStore);

  useEffect(() => {
    $setStepType(StepTypes.Preview);
    localStorage.setItem('way', `${StepTypes.Preview}`);

    window.scrollTo({ top: -999 });
  }, []);

  const next = () => {
    let aspect = 2 / 3;

    switch (+size) {
      case ImageSize.Small:
        aspect = 2 / 3;
        break;
      case ImageSize.Medium:
        aspect = 3 / 4;
        break;
      case ImageSize.Large:
        aspect = 4 / 5;
        break;
    }

    FilterManager.setImageSize(+size);
    localStorage.setItem('size', size.toString());
    setCropImageStore({ ...cropStore, aspect });
    $setPreviewStore({
      ...previewStore,
      size,
    });

    navigate(AppRoute.StepUploadPhoto);
  };

  return (
    <section className={css.section}>
      <Header className={css.header} />
      <div className={clsx(css.wrapper, 'wrapper')}>
        <BackButton className={css.backButton} path={AppRoute.Main}>
          <span>Назад</span>
        </BackButton>
        <div className={css.content}>
          <div className={css.block}>
            <StepTitle className={css.step} step={1} text="Выберите размер" />
            <Radio
              name="size"
              items={radio1}
              defaultValue={radio1[0].value}
              onChange={setSize}
              active={size}
            />
          </div>

          <div className={css.block}>
            <StepTitle className={css.step} step={2} text="Выберите цвет" />
            <Radio
              name="color"
              items={radio2}
              defaultValue={radio2[0].value}
              onChange={setColorSet}
              active={colorSet}
            />
            <PrimaryButton className={css.button} text="Далее" handler={next} />
          </div>
        </div>
      </div>
    </section>
  );
};
