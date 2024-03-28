import { createEvent, createStore, forward } from 'effector';
import { ColorSet } from '@/pixelation/PixelationTypes.ts';

type ImageStore = {
  aspect: number;
  colorSet: ColorSet;
  imageSrc: string;
};

export const $cropImageStore = createStore<ImageStore>({
  aspect: 2 / 3,
  colorSet: ColorSet.BlackAndWhite,
  imageSrc: '',
});
export const setCropImageStore = createEvent<ImageStore>();

forward({
  from: setCropImageStore,
  to: $cropImageStore,
});
