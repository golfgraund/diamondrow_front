/**
 * Набор цветов
 */
export enum ColorSet {
  BlackAndWhite,
  Sepia,
  PopArt,
}

export enum ColorFilter {
  Normal,
  Lighter,
  Lightest,
  Darker,
  Darkest,
}

/**
 * Размер мозайки
 */
export enum ImageSize {
  Small,
  Medium,
  Large,
}

export interface PixelateQuery {
  type: 'image';
  id: string;
  image: Uint8Array;
  color: ColorSet | null;
  filter: ColorFilter;
  size: ImageSize;
  horizontal: boolean;
}

export interface PixelateCanvas {
  type: 'canvas';
  canvas: OffscreenCanvas;
}

export interface PixelateResponse {
  id: string;
  source: Uint8Array;
  result: Uint8Array | null;
}

/**
 * Палитры мозаек, от самого яркого к самому тусклому
 */
export const COLORS: [number, number, number][][] = [
  [
    [255, 255, 255], // ЧБ
    [236, 236, 236],
    [209, 209, 209],
    [108, 108, 108],
    [66, 66, 66],
    [0, 0, 0],
  ],
  [
    [242, 227, 195], // Сепия
    [203, 182, 156],
    [138, 110, 78],
    [148, 99, 26],
    [73, 42, 19],
    [75, 60, 42],
    [30, 17, 8],
  ],
  [
    [255, 255, 255], // Поп-арт
    [255, 241, 175],
    [255, 181, 21],
    [100, 171, 186],
    [224, 40, 118],
    [92, 84, 120],
    [0, 0, 0],
  ],
];

/**
 * Размеры мозаек в точках
 */
export const SIZES: [number, number][] = [
  [115, 75],
  [155, 115],
  [195, 155],
];

/**
 * Максимальное количество одного цвета по размерам
 */
export const COLOR_QUOTA: number[] = [
  2933, //
  6061,
  10277,
];
