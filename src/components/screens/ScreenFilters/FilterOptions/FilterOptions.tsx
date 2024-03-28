import { useEffect, useRef, useState } from 'react';
import { useStore } from 'effector-react';
import { SlideItem } from '@/components/shared/Slider/SlideItem/SlideItem.tsx';
import { Slider } from '@/components/shared/Slider/Slider.tsx';
import css from './FilterOptions.module.scss';

import { FilterPreviewHandler } from '@/components/screens/ScreenFilters/FilterOptions/FilterPreviewHandler.ts';
import { FilterManager } from '@/mosaic/FilterManager';
import { $imgCropStatus } from '@/stores/ImgCropStatus';

export const FilterOptions = () => {
  const [sources, setSources] = useState<string[]>([]);
  const [activeImgIndex, setActiveImageIndex] = useState<number>(0);
  const isLoaded = useStore($imgCropStatus);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handlerRef = useRef<FilterPreviewHandler | null>(null);

  useEffect(() => {
    if (isLoaded) {
      FilterManager.generateFilterImages().then((result) => setSources(result));
    }
  }, [isLoaded]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && sources.length && isLoaded) {
      const { source, crop } = FilterManager.getCropState();
      const handler = new FilterPreviewHandler(canvas, sources, source, crop);
      handlerRef.current = handler;

      return () => {
        handler.dispose();
        handlerRef.current = null;
        console.debug('destroy');
      };
    }
  }, [isLoaded, sources]);

  useEffect(() => {
    handlerRef.current?.setFrame(activeImgIndex);
  }, [activeImgIndex, sources, isLoaded]);

  const onClick = (index: number) => {
    setActiveImageIndex(index);
    FilterManager.setActiveMatrix(index);
  };

  return (
    <div className={css.variants}>
      <div className={css.main}>
        <canvas ref={canvasRef} />
      </div>
      <Slider className={css.slider} navigation spaceBetween={8}>
        {sources &&
          sources.map((item, index) => (
            <SlideItem
              key={`${item}-${index}`}
              img={sources[index]}
              index={index}
              active={activeImgIndex === index}
              onClick={() => onClick(index)}
            />
          ))}
      </Slider>
    </div>
  );
};
