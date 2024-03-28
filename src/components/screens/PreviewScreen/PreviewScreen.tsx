import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';
import css from './PreviewScree.module.scss';
import { AppRoute } from '@/app-routes';
import catSrc from '@/assets/images/preview/cat.png';
import imagesSrc from '@/assets/images/preview/images.png';
import stoneSrc from '@/assets/images/preview/stone.png';
import { Header } from '@/components/header/Header';
import { FilterManager } from '@/mosaic/FilterManager';
import { ImageSize } from '@/pixelation/PixelationTypes.ts';
import { $imgCropStatus } from '@/stores/ImgCropStatus';

const COLOR_NAMES = ['Чёрно-белая', 'Винтаж', 'Поп-арт'];
const IMAGE_SIZES = ['20x30', '30x40', '40x50'];

export const PreviewScreen = () => {
  const [sources, setSources] = useState<string[]>([]);
  const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.Small);
  const navigate = useNavigate();
  const isLoaded = useStore($imgCropStatus);

  useEffect(() => {
    const set = FilterManager.getImageSize();
    setImageSize(set);
    window.scrollTo({ top: 0 });

    if (isLoaded) {
      FilterManager.generatePreviewImages().then((srcs) => {
        if (srcs) {
          setSources(srcs);
        }
      });
    } else {
      navigate(AppRoute.StepUploadPhoto);
    }
  }, [isLoaded, navigate]);

  return (
    <section className={css.section}>
      <Header className={css.header} />
      <div className={css.section__images}>
        <div className={clsx(css.section__images_title, 'h1', 'fw-bold')}>
          Такой получится ваша мозаика:
        </div>
        <div className={css.section__images_block}>
          {sources &&
            sources.map((s, index) => (
              <div key={index}>
                <img src={s} alt={`imgi-${index}`} />
                <p className={clsx('text-l', 'fw-bold')}>{`${COLOR_NAMES[index]}`}</p>
                <p className="text-m">{`${IMAGE_SIZES[imageSize]} см`}</p>
              </div>
            ))}
        </div>
      </div>
      <div className={css.section__markets}>
        <img className={css.section__markets_cat} src={catSrc} alt="cat" />
        <img className={css.section__markets_stone} src={stoneSrc} alt="stone" />
        <div className={clsx('title', 'h1', 'fw-bold')}>Понравился результат?</div>
        <p className="text-l">
          Выберите размер и цвет мозаики и закажите набор удобным вам способом
        </p>
        <div className="h3">Маркетплейсы:</div>
        <a
          href={import.meta.env.VITE_APP_WB}
          className={clsx(css.button, 'button button--secondary button--wb')}
        >
          <span className="text-m">Wildberries</span>
        </a>
        <a
          href={import.meta.env.VITE_APP_OZON}
          className={clsx(css.button, 'button button--secondary button--ozon')}
        >
          <span className="text-m">Ozon</span>
        </a>
      </div>
      <div className={css.section__more}>
        <div>
          <div className={clsx(css.section__more_title, 'h1', 'fw-bold')}>
            Нужно больше вариантов?
          </div>
          <p className="text-l">
            Вместе с набором вы получите расширенный редактор изображений. В нём вы найдёте вариант
            мозаики, который вам точно понравится.
          </p>
        </div>
        <div className={css.section__more_images}>
          <img src={imagesSrc} alt="preview" />
        </div>
      </div>
    </section>
  );
};
