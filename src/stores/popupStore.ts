import { createEvent, createStore, forward } from 'effector';

export const $popupStore = createStore<boolean>(false);

export const setIsPopupOpen = createEvent<boolean>();

forward({
  from: setIsPopupOpen,
  to: $popupStore,
});
