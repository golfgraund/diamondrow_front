import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { FixedCropper, FixedCropperRef, ImageRestriction } from 'react-advanced-cropper';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';
import css from './ScreenFraming.module.scss';
import { AppRoute } from '@/app-routes';
import CropPreview from '@/components/animations/CropPreview/CropPreview';
import { Header } from '@/components/header/Header.tsx';
import { BackButton } from '@/components/ui/buttons/BackButton/BackButton.tsx';
import { PrimaryButton } from '@/components/ui/buttons/PrimaryButton/PrimaryButton.tsx';
import { SecondaryButton } from '@/components/ui/buttons/SecondaryButton/SecondaryButton.tsx';
import { FilterManager } from '@/mosaic/FilterManager';

import { $cropImageStore } from '@/mosaic/ImageStore';
import { StepTypes } from '@/stores/stepTypeStore';
import 'react-advanced-cropper/dist/style.css';
import { ImageSize } from '@/pixelation/PixelationTypes.ts';

export const ScreenFraming = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1599140849279-1014532882fe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80',
  );
  const [tempWay, setTempWay] = useState<StepTypes>(StepTypes.Preview);
  // Стор для кропа
  const cropImageStore = useStore($cropImageStore);
  const imgSize = Number(localStorage.getItem('size'));
  useEffect(() => {
    const way = Number(localStorage.getItem('way'));

    setTempWay(way);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: -999 });
    if (cropImageStore.imageSrc) {
      setImage(cropImageStore.imageSrc);
      FilterManager.setHorizontal(true);
    } else if (tempWay === StepTypes.Waiting) {
      navigate(AppRoute.Main);
    } else {
      navigate(AppRoute.StepUploadPhoto);
    }
  }, [cropImageStore, navigate]);

  const crop = () => {
    const cropEl = cropRef.current!;
    const src = cropEl.getCanvas()!.toDataURL();
    localStorage.setItem('way', tempWay.toString());

    FilterManager.crop(src, cropEl.getImage()!.src, cropEl.getState()).then(() => {
      if (tempWay === StepTypes.Generate) {
        navigate(AppRoute.StepFilters);
      } else if (tempWay === StepTypes.Preview) {
        navigate(AppRoute.Preview);
      }
    });
  };

  const cropRef = useRef<FixedCropperRef>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 100, h: 100 });

  useEffect(() => {
    const wrap = wrapRef.current;
    let aspect = 2 / 3;

    switch (imgSize) {
      case ImageSize.Small:
        aspect = 2 / 3;
        break;
      case ImageSize.Medium:
        aspect = 3 / 4;
        break;
      case ImageSize.Large: {
        aspect = 4 / 5;
        break;
      }
    }

    if (wrap) {
      const { width: targetWidth } = wrap.getBoundingClientRect();
      const scale = 0.9;

      const width = targetWidth * scale;
      const height = targetWidth * scale * aspect;

      FilterManager.setImageSize(imgSize);
      setSize({
        w: width,
        h: height,
      });
    }
  }, [cropRef, cropImageStore]);

  const rotateStencil = () => {
    const w = size.w;
    const h = size.h;
    setSize({ w: h, h: w });
    FilterManager.setHorizontal(w < h);
  };
  const rotateImage = () => {
    const c = cropRef.current!;
    c.rotateImage(90);
  };
  const zoomIn = () => {
    const c = cropRef.current!;
    c.zoomImage(1.1);
  };

  const zoomOut = () => {
    const c = cropRef.current!;
    c.zoomImage(0.9);
  };

  return (
    <section className={css.section}>
      <Header className={css.header} />
      <div className={clsx(css.wrapper, 'wrapper')} ref={wrapRef}>
        <BackButton className={css.backButton} path={AppRoute.StepUploadPhoto}>
          <span>Назад</span>
        </BackButton>
        <div className={css.content}>
          <div className={css.crop_wrap}>
            <CropPreview />
            <FixedCropper
              src={image}
              ref={cropRef}
              className={css.cropper}
              stencilSize={{
                width: size.w,
                height: size.h,
              }}
              stencilProps={{
                grid: true,
                lines: true,
                handlers: false,
                movable: false,
                resizable: false,
              }}
              imageRestriction={ImageRestriction.stencil}
            />
          </div>
          <div className={css.buttons}>
            <SecondaryButton
              className={css.button}
              icon="horizontal-orientation"
              handler={rotateStencil}
            />
            <SecondaryButton className={css.button} icon="rotate" handler={rotateImage} />
            <SecondaryButton className={css.button} icon="plus" handler={zoomIn} />
            <SecondaryButton className={css.button} icon="minus" handler={zoomOut} />
          </div>
          <p className={clsx(css.text, 'text-m', 'fw-medium')}>
            Выберите область фотографии для мозаики.
            <br />
            Если фото не подходит, вы можете вернуться назад и загрузить другое.
          </p>
          <PrimaryButton className={css.buttonNext} text="Далее" handler={crop} />
        </div>
      </div>
    </section>
  );
};
