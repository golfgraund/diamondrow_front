import { useEffect } from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';
import { StepTitle } from '@/components/shared/StepTitle/StepTitle.tsx';
import css from './ScreenUploadPhoto.module.scss';
import { AppRoute } from '@/app-routes.ts';
import exampleImage from '@/assets/images/upload-photo/upload-example.png';
import exampleImage2x from '@/assets/images/upload-photo/upload-example@2x.png';
import { Header } from '@/components/header/Header.tsx';
import { BackButton } from '@/components/ui/buttons/BackButton/BackButton.tsx';
import { $cropImageStore, setCropImageStore } from '@/mosaic/ImageStore';
import { ImageSize } from '@/pixelation/PixelationTypes.ts';
import { $previewStore, $setPreviewStore } from '@/stores/previewStore';
import { $stepTypeStore, StepTypes } from '@/stores/stepTypeStore';

export const ScreenUploadPhoto = () => {
  const navigate = useNavigate();
  const cropStore = useStore($cropImageStore);
  const stepStore = useStore($stepTypeStore);
  const previewStore = useStore($previewStore);
  const way: StepTypes = Number(localStorage.getItem('way'));

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageBlob = e.target.files!.item(0);

    const fileLoader = new FileReader();
    fileLoader.readAsDataURL(imageBlob!);

    fileLoader.onloadend = async () => {
      const src = fileLoader.result as string;
      setCropImageStore({
        ...cropStore,
        imageSrc: src,
      });
      navigate(AppRoute.StepFraming);
    };
  };

  useEffect(() => {
    window.scrollTo({ top: -999 });

    if (way === StepTypes.Preview) {
      const size = Number(localStorage.getItem('size'));
      let aspect = 2 / 3;
      if (size) {
        switch (size) {
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
      }
      setCropImageStore({ ...cropStore, aspect });
      $setPreviewStore({
        ...previewStore,
        size,
      });
    } else if (way === StepTypes.Generate) {
      //
    } else {
      navigate(AppRoute.Main);
    }
  }, []);

  return (
    <section className={css.section}>
      <Header className={css.header} />
      <div className={clsx(css.wrapper, 'wrapper')}>
        <BackButton
          className={css.backButton}
          path={way === StepTypes.Generate ? AppRoute.StepCode : AppRoute.StepColorSize}
        >
          <span>Назад</span>
        </BackButton>
        <div className={css.content}>
          <div className={css.block}>
            <h2 className={clsx(css.title, 'fw-bold')}>Как выбрать фото для мозаики?</h2>
            <p className={clsx(css.text, 'text-m', 'fw-medium')}>
              Избегайте однородного фона, чем больше деталей, тем интереснее получится мозаика.
            </p>
            <p className={clsx(css.text, 'text-m', 'fw-medium')}>
              После загрузки фото вы сможете его обрезать или повернуть. Старайтесь выделять крупные
              объекты или лица. Тогда мозаика получится чётче и детальнее.
            </p>
            <picture className={css.picture}>
              <img src={exampleImage} srcSet={exampleImage2x} alt="Bad/good examples" />
            </picture>
          </div>
          <div className={css.block}>
            <StepTitle
              className={css.step}
              step={stepStore === StepTypes.Preview ? 3 : 2}
              text="Загрузите фото"
            />
            <label className={css.input}>
              <input
                type="file"
                accept={'capture=camera,image/*'}
                style={{ cursor: 'pointer' }}
                onChange={(e) => uploadImage(e)}
              />
              <span>Загрузить фото</span>
            </label>

            {/* <PrimaryButton className={css.button} text="Загрузить фото" handler={loadImage} /> */}
            <ul className={clsx(css.list, 'list')}>
              <li>Размер файла не больше 15 МБ</li>
              <li>Форматы JPEG, JPG, PNG</li>
              <li>Избегайте однородного фона и темных фото</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
