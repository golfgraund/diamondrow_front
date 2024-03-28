import { $cropImageStore, setCropImageStore } from '@/mosaic/ImageStore';

export const setCropImage = (cb: () => void) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'capture=camera,image/*';
  console.debug('create');
  input.addEventListener(
    'change',
    (e) => {
      console.debug(e);
      uploadImage(input, cb);
    },
    false,
  );
  console.debug('click');
  input.click();
};

const uploadImage = (input: HTMLInputElement, cb: () => void) => {
  const imageBlob = input.files!.item(0);
  console.debug(input);

  const fileLoader = new FileReader();
  fileLoader.readAsDataURL(imageBlob!);

  fileLoader.onloadend = async () => {
    const src = fileLoader.result as string;
    const cropStore = $cropImageStore.getState();
    setCropImageStore({
      ...cropStore,
      imageSrc: src,
    });
    cb();
    input.remove();
  };
};
