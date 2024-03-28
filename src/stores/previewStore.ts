import { createEvent, createStore, forward } from 'effector';
import { ImageSize } from '@/pixelation/PixelationTypes.ts';

type PreviewStore = {
  size: ImageSize;
  src: string;
};
export const $previewStore = createStore<PreviewStore>({
  size: ImageSize.Small,
  src: '',
});
export const $setPreviewStore = createEvent<PreviewStore>();

forward({
  from: $setPreviewStore,
  to: $previewStore,
});
