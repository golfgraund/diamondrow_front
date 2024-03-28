import { createEvent, createStore, forward } from 'effector';

export const $imgCropStatus = createStore<boolean>(false);

export const $setCropStatus = createEvent<boolean>();

forward({
  from: $setCropStatus,
  to: $imgCropStatus,
});
