import PixelateWorker from '../workers/PixelateWorker.ts?worker';
import { PixelateProcessor } from '@/pixelation/PixelateProcessor.ts';
import {
  ColorFilter,
  ColorSet,
  ImageSize,
  PixelateCanvas,
  PixelateQuery,
  PixelateResponse,
  SIZES,
} from '@/pixelation/PixelationTypes.ts';

const htmlCanvas = document.createElement('canvas');
const fallbackCanvas = document.createElement('canvas');
const worker = new PixelateWorker();
if ('transferControlToOffscreen' in htmlCanvas) {
  const offscreenCanvas = htmlCanvas.transferControlToOffscreen();
  worker.postMessage(
    {
      type: 'canvas',
      canvas: offscreenCanvas,
    } as PixelateCanvas,
    [offscreenCanvas],
  );
}

export async function pixelate(
  image: HTMLImageElement | string,
  colorSet: ColorSet | null,
  imageSize: ImageSize,
  filter: ColorFilter,
  horizontal: boolean,
): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve) => {
    const process = (img: Uint8Array) => {
      const id = Array(32)
        .fill('')
        .map(() => String.fromCharCode(Math.floor(Math.random() * 25) + 97))
        .join('');

      const handleResult = (e: MessageEvent) => {
        const data = e.data as PixelateResponse;
        if (data.id === id) {
          worker.removeEventListener('message', handleResult);
          if (data.result) {
            console.debug('worker');
            resolve(data.result);
          } else {
            console.debug('fallback');
            const context = fallbackCanvas.getContext('webgl')!;
            const proc = new PixelateProcessor(
              context,
              data.source,
              imageSize,
              colorSet,
              filter,
              horizontal,
            );
            const result = proc.build();
            proc.dispose();
            resolve(result);
          }
        }
      };

      const query: PixelateQuery = {
        type: 'image',
        id,
        image: img,
        color: colorSet,
        size: imageSize,
        filter,
        horizontal,
      };

      worker.addEventListener('message', handleResult);
      worker.postMessage(query);
    };

    const imageToBitmap = (img: HTMLImageElement) => {
      const canvas = document.createElement('canvas');
      let [width, height] = SIZES[imageSize];
      if (!horizontal) {
        [height, width] = [width, height];
      }
      canvas.width = width;
      canvas.height = height;

      const [bx, by, bw, bh] = [0, 0, img.width, img.height];
      const aspect = Math.max(width / bw, height / bh);
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingQuality = 'high';
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(
        img,
        bx,
        by,
        bw,
        bh,
        width * 0.5 - (bw * aspect) / 2,
        height * 0.5 - (bh * aspect) / 2,
        bw * aspect,
        bh * aspect,
      );
      const imgData = ctx.getImageData(0, 0, width, height);

      const luma = new Uint8Array(width * height);
      for (let i = 0; i < luma.length; i++) {
        const j = i * 4;
        luma[i] = Math.max(
          Math.min(
            ((0.2126 * imgData.data[j]) / 255.0 +
              (0.7152 * imgData.data[j + 1]) / 255.0 +
              (0.0722 * imgData.data[j + 2]) / 255.0) *
              255.0,
            255,
          ),
          0,
        );
      }

      process(luma);
    };

    if (image instanceof HTMLImageElement) {
      imageToBitmap(image as HTMLImageElement);
    } else {
      new Promise<HTMLImageElement>((r) => {
        const img = new Image();
        img.addEventListener('load', () => r(img));
        img.src = image;
      }).then((img) => imageToBitmap(img));
    }
  });
}
