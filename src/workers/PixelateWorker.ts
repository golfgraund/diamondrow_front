import { PixelateProcessor } from '@/pixelation/PixelateProcessor.ts';
import { PixelateCanvas, PixelateQuery, PixelateResponse } from '@/pixelation/PixelationTypes.ts';

let context: WebGLRenderingContext | null = null;

onmessage = (ev: MessageEvent) => {
  const data = ev.data as PixelateQuery | PixelateCanvas;
  if (data.type === 'canvas') {
    context = data.canvas.getContext('webgl')!;
  } else {
    const { image, id, size, color, filter, horizontal } = ev.data as PixelateQuery;
    let result: Uint8Array | null = null;
    if (context) {
      const proc = new PixelateProcessor(context, image, size, color, filter, horizontal);
      result = proc.build();
      proc.dispose();
    }

    const out: PixelateResponse = {
      id,
      source: image,
      result,
    };
    postMessage(out);
  }
};
