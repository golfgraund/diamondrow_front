import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { Slider } from '@/components/shared/Slider/Slider';
import css from './ScreenConstructor.module.scss';
import { AppRoute } from '@/app-routes.ts';
import { Animation, Animations } from '@/components/animations/Animation';
import { Footer } from '@/components/footer/Footer.tsx';
import { SecondaryButton } from '@/components/ui/buttons/SecondaryButton/SecondaryButton.tsx';
import { MosaicManager } from '@/mosaic/MosaicManager';

export const ScreenConstructor = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [blocks, setBlocks] = useState<number[]>([]);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [isPopUp, setIsPopUp] = useState<boolean>(false);
  const [activeBlock, setActiveBlock] = useState<number>(0);
  const [hintActive, setHintActive] = useState<boolean>(true);
  const [imageSize, setImageSize] = useState<[number, number]>([1, 1]);
  const [popupImage, setPopupImage] = useState<HTMLImageElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: -999 });
  }, []);

  useEffect(() => {
    if (imgSrc) {
      const img = new Image();
      img.onload = () => {
        setPopupImage(img);
      };
      img.src = imgSrc;
    }
  }, [imgSrc]);

  useEffect(() => {
    if (isPopUp && popupImage) {
      const updateImageSize = () => {
        const gapX = 30;
        const gapY = 100;
        const cw = window.innerWidth - gapX * 2;
        const ch = window.innerHeight - gapY * 2;
        const iw = popupImage.naturalWidth;
        const ih = popupImage.naturalHeight;
        const aspect = Math.min(cw / iw, ch / ih);

        setImageSize([iw * aspect, ih * aspect]);
      };
      window.addEventListener('resize', updateImageSize, { passive: true });
      updateImageSize();

      return () => {
        window.removeEventListener('resize', updateImageSize);
      };
    }
  }, [isPopUp, popupImage]);

  useEffect(() => {
    const canvas = canvasRef.current;

    const loc = window.location.href.split('/');
    const slug = loc[loc.length - 1];
    if (slug === ':slug') {
      const localSlug = localStorage.getItem('slug')!;
      window.location.replace(`/constructor/${localSlug}`);
    }

    if (canvas && slug) {
      MosaicManager.init(
        canvas,
        slug,
        (src) => setImgSrc(src),
        () => {},
      ).then(() => {
        const amount = MosaicManager.getBlocksAmount();
        const sliderItems = [];

        for (let i = 0; i < amount; i++) {
          sliderItems.push(i);
        }

        setBlocks(sliderItems);
      });

      return () => {
        MosaicManager.dispose();
      };
    }
    navigate(AppRoute.Main);
  }, []);

  return (
    <section className={css.section}>
      <div className={clsx(css.wrapper, 'wrapper wrapper--slider')}>
        <div className={css.content}>
          <SecondaryButton
            className={css.button}
            navLink={AppRoute.Instruction}
            text="Как пользоваться инструкцией?"
          />
          <canvas ref={canvasRef} />
          <div className={css.controls}>
            <button
              className={clsx(css.button, 'button button--secondary')}
              onClick={() => MosaicManager.clearBlock()}
            >
              Сбросить
            </button>
            <button
              className={clsx(css.button, 'button button--secondary')}
              onClick={() => MosaicManager.undo()}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.5918 5.78738V10.0731H9.87751"
                  stroke="#787878"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.68937 14.6165C7.39724 15.8957 7.87833 16.2986 8.91651 17.0049C11.0699 18.4701 13.9844 18.3051 15.9672 16.5901C19.0628 13.9127 18.5264 8.73409 15.0145 6.74966C13.8997 6.11972 12.6149 5.87718 11.3535 6.05858C8.84729 6.419 7.76184 7.89649 6 9.6"
                  stroke="#787878"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <p className={css.sectors_header}>Секторы:</p>
          {blocks.length > 0 && (
            <Slider className={css.slider} navigation extra spaceBetween={12}>
              {blocks.map((_, i) => (
                <button
                  className={clsx(css.slider__slide, i === activeBlock && css.active)}
                  onClick={() => {
                    MosaicManager.setActiveBlock(i);
                    setActiveBlock(i);
                  }}
                  onMouseDown={() => setHintActive(false)}
                  onTouchStart={() => setHintActive(false)}
                  key={i}
                >
                  {i + 1}
                </button>
              ))}
            </Slider>
          )}
          <div className={clsx(css.hint, hintActive && css.active)}>
            <Animation type={Animations.drag} secondary />
          </div>
          <p className={css.amount}>{`Всего секторов: ${blocks.length}`}</p>
        </div>
        <div className={css.preview} onClick={() => setIsPopUp(true)}>
          <img src={imgSrc} alt="preview" />
        </div>
      </div>
      <Footer className={css.footer} />
      <div className={clsx(css.fullImg, isPopUp && css.active)}>
        <div className={css.fullImg_bg} onClick={() => setIsPopUp(false)} />
        <div className={css.fullImg_img}>
          <img
            src={imgSrc}
            alt="preview"
            style={{
              width: `${imageSize[0]}px`,
              height: `${imageSize[1]}px`,
            }}
          />
          <button
            className={clsx(css.button, 'button button--secondary')}
            onClick={() => setIsPopUp(false)}
          >
            Закрыть
          </button>
        </div>
      </div>
    </section>
  );
};
