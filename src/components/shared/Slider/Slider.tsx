import { Children, ReactNode, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { SliderHandler } from '@/components/shared/Slider/SliderHandler';
import css from './Slider.module.scss';
import { Icon } from '@/components/icons/Icon.tsx';

interface SliderProps {
  navigation?: boolean;
  extra?: boolean;
  children: ReactNode;
  className?: string;
  spaceBetween?: number;
}

export function Slider({ children, navigation, extra, className, spaceBetween = 0 }: SliderProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const handlerRef = useRef<SliderHandler | null>(null);
  const [currentProgress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>();

  useEffect(() => {
    if (window.innerWidth < 1080) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  useEffect(() => {
    if (blockRef.current && wrapRef.current) {
      handlerRef.current = new SliderHandler(
        wrapRef.current,
        blockRef.current,
        setProgress,
        spaceBetween,
      );

      return () => {
        handlerRef.current?.detach();
      };
    }
  }, []);

  useEffect(() => {
    handlerRef.current?.realign();
  }, [children]);

  const nextSlide = () => {
    handlerRef.current?.nextSlide();
  };

  const prevSlide = () => {
    handlerRef.current?.prevSlide();
  };

  const nextBlock = () => {
    handlerRef.current?.nextBlock();
  };

  const prevBlock = () => {
    handlerRef.current?.prevBlock();
  };

  const items: ReactNode[] = Children.toArray(children);
  // const barStyle: CSSProperties = {
  //   width: `${currentProgress * 100}%`,
  // };

  return (
    <div className={clsx(css.slider, className)}>
      {!isMobile && navigation && extra && (
        <button
          className={clsx(
            css.arrow,
            css.prev,
            css.extra,
            'arrow-prev',
            'button button--secondary',
            currentProgress <= 0 && css.disabled,
          )}
          type="button"
          onClick={prevBlock}
        >
          <Icon id="arrow-left" />
          <span>-20</span>
        </button>
      )}
      {!isMobile && navigation && (
        <button
          className={clsx(css.arrow, css.prev, 'arrow-prev', currentProgress <= 0 && css.disabled)}
          type="button"
          onClick={prevSlide}
        >
          <Icon id="arrow-left" />
        </button>
      )}

      <div className={css.slider__container} ref={blockRef}>
        <div className={css.slider__wrapper} ref={wrapRef}>
          {items.map((item, idx) => (
            <div
              className={css.slider__item}
              key={idx}
              style={{ marginLeft: `${idx === 0 ? 0 : spaceBetween}px` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {!isMobile && navigation && (
        <button
          className={clsx(css.arrow, css.next, 'arrow-next', currentProgress >= 1 && css.disabled)}
          type="button"
          onClick={nextSlide}
        >
          <Icon id="arrow-right" />
        </button>
      )}
      {!isMobile && navigation && extra && (
        <button
          className={clsx(
            css.arrow,
            css.next,
            css.extra,
            'arrow-next',
            'button button--secondary',
            currentProgress >= 1 && css.disabled,
          )}
          type="button"
          onClick={nextBlock}
        >
          <span>+20</span>
          <Icon id="arrow-right" />
        </button>
      )}
    </div>
  );
}
