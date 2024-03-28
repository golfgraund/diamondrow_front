import { OutMatrixType } from '@/mosaic/MosaicManager';
import { COLORS, ColorSet, ImageSize, SIZES } from '@/pixelation/PixelationTypes.ts';

/**
 * Сборка PNG из данных и палитры
 * @param data
 * @param colorSet
 * @param canvasSize
 * @param horizontal
 */
export function createImageFromPalette(
  data: number[] | Uint8Array,
  colorSet: ColorSet,
  canvasSize: ImageSize,
  horizontal: boolean,
) {
  const height = horizontal ? SIZES[canvasSize][1] : SIZES[canvasSize][0];
  const width = horizontal ? SIZES[canvasSize][0] : SIZES[canvasSize][1];
  const colors = COLORS[colorSet];

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  // Прямой лукап по палитре
  const ctx = canvas.getContext('2d')!;
  const outData = ctx.getImageData(0, 0, width, height);
  for (let i = 0; i < data.length; i++) {
    const c = data[i];
    const p = i * 4;
    outData.data[p] = colors[c][0];
    outData.data[p + 1] = colors[c][1];
    outData.data[p + 2] = colors[c][2];
    outData.data[p + 3] = 255;
  }
  ctx.putImageData(outData, 0, 0);

  return generateMatrix(colors, outData.data);
}

export function createImageFromMatrix(
  data: Uint8ClampedArray,
  colorSet: ColorSet | null,
  canvasSize: ImageSize,
  horizontal: boolean,
) {
  const height = horizontal ? SIZES[canvasSize][1] : SIZES[canvasSize][0];
  const width = horizontal ? SIZES[canvasSize][0] : SIZES[canvasSize][1];

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  // Прямой лукап по палитре
  const ctx = canvas.getContext('2d')!;
  const outData = ctx.getImageData(0, 0, width, height);
  for (let i = 0; i < data.length; i++) {
    const c = data[i];
    const p = i * 4;
    if (colorSet === null) {
      outData.data[p] = c;
      outData.data[p + 1] = c;
      outData.data[p + 2] = c;
    } else {
      const colors = COLORS[colorSet][c];
      outData.data[p] = colors[0];
      outData.data[p + 1] = colors[1];
      outData.data[p + 2] = colors[2];
    }

    outData.data[p + 3] = 255;
  }
  ctx.putImageData(outData, 0, 0);

  return canvas.toDataURL('image/png');
}

export function generateMatrix(colors: number[][], data: Uint8ClampedArray) {
  const mat: OutMatrixType = {
    matrix: [],
    colors,
  };
  const od = data;
  for (let i = 0; i < od.length; i += 4) {
    const r = od[i];
    const g = od[i + 1];
    const b = od[i + 2];

    const index = colors.findIndex((c) => c[0] === r && c[1] === g && c[2] === b);

    mat.matrix.push({
      r,
      g,
      b,
      filled: false,
      index,
    });
  }

  return mat;
}
