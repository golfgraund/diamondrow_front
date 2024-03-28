import { createEvent, createStore, forward } from 'effector';
import { RGB } from '@/mosaic/MosaicManager';

type UserStore = {
  email: string;
  code: string;
  matrix_progress: RGB[][];
  picture_file: Blob | null;
  colorSet_File: Blob | null;
  pictures_pdf: Blob[];
  preview_picture_type: string;
};

const defaultValue: UserStore = {
  email: '',
  code: '',
  matrix_progress: [],
  picture_file: null,
  colorSet_File: null,
  pictures_pdf: [],
  preview_picture_type: 'wide',
};

export const $userStore = createStore<UserStore>(defaultValue);
export const $setUserStore = createEvent<UserStore>();

forward({
  from: $setUserStore,
  to: $userStore,
});
