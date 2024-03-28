import { useEffect, useState } from 'react';
import TestImage1 from '../../assets/debug/ph1.jpg';
import TestImage2 from '../../assets/debug/ph2.jpg';
import TestImage3 from '../../assets/debug/ph3.jpg';
import TestImage4 from '../../assets/debug/ph4.jpg';
import TestImage5 from '../../assets/debug/ph5.jpg';
import css from './MosaicDebug.module.scss';
import { DrawImagesManger } from '@/mosaic/DrawImagesManger.ts';
import { createImageFromPalette } from '@/mosaic/pixelateImage.ts';
import { pixelate } from '@/pixelation/Pixelation.ts';
import { ColorFilter, ColorSet, ImageSize, SIZES } from '@/pixelation/PixelationTypes.ts';

const IMAGE_SRC: string[] = [TestImage5, TestImage1, TestImage2, TestImage3, TestImage4];

export function MosaicDebug() {
  const [size, setSize] = useState(ImageSize.Small);
  const [colors, setColors] = useState(ColorSet.BlackAndWhite);
  const [finalImages, setFinalImages] = useState<string[][]>([]);

  useEffect(() => {
    const filters = [
      ColorFilter.Darkest,
      ColorFilter.Darker,
      ColorFilter.Normal,
      ColorFilter.Lighter,
      ColorFilter.Lightest,
      // null,
    ];

    const convert = (src: string, filter: ColorFilter | null) =>
      new Promise<string>((resolve) => {
        const img = new Image();
        img.onload = () => {
          pixelate(
            img,
            filter === null ? null : colors,
            size,
            filter || ColorFilter.Normal,
            false,
          ).then((data) => {
            // const src1 = createImageFromMatrix(
            //   new Uint8ClampedArray(data),
            //   filter === null ? null : colors,
            //   size,
            //   false,
            // );

            resolve(
              DrawImagesManger.getFullImage(
                createImageFromPalette(data, colors, size, false),
                SIZES[size][1],
                SIZES[size][0],
                true,
                true,
              )!,
            );
          });
        };
        img.src = src;
      });

    for (let i = 0; i < IMAGE_SRC.length; i++) {
      const base = IMAGE_SRC[i];
      const pos = i;

      Promise.all(filters.map((filter) => convert(base, filter))).then((sources) => {
        setFinalImages((prev) => {
          const copy = [...prev];
          copy[pos] = [base, ...sources];

          return copy;
        });
      });
    }
  }, [size, colors]);

  const sizeList = [
    'Маленькая', //
    'Средняя',
    'Большая',
  ];
  const colorList = [
    'Черно-белый', //
    'Сепия',
    'Поп-арт',
  ];

  return (
    <div className={css.block}>
      <div>
        <select value={size} onChange={(e) => setSize(parseInt(e.target.value))}>
          {sizeList.map((sz, idx) => (
            <option value={idx} key={sz}>
              {sz}
            </option>
          ))}
        </select>
        <select value={colors} onChange={(e) => setColors(parseInt(e.target.value))}>
          {colorList.map((sz, idx) => (
            <option value={idx} key={sz}>
              {sz}
            </option>
          ))}
        </select>
      </div>
      {finalImages.map((list, i) => (
        <div key={`test_${i}`}>{list && list.map((src) => <img src={src} key={src} />)}</div>
      ))}
    </div>
  );
}
