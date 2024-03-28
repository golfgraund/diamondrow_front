import blackWhiteSetImg from '../assets/images/color-preset/black-white.svg';
import popArtSetImg from '../assets/images/color-preset/pop-art.svg';
import sepiaSetImg from '../assets/images/color-preset/sepia.svg';
import { OutMatrixType } from '@/mosaic/MosaicManager';
import { ColorSet } from '@/pixelation/PixelationTypes.ts';
import { $setUserStore, $userStore } from '@/stores/userStore';

// const ALPHA = [0.1, 0.3, 0.4, 0.2];

// const rotateVec = (x: number, y: number, angle: number): readonly [number, number] => {
//   const sn = Math.sin(angle);
//   const cs = Math.cos(angle);
//
//   return [x * cs - y * sn, x * sn + y * cs];
// };

const TILES = new Image();
TILES.src =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAUCAYAAADRA14pAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKiSURBVHgB1djLitpQGMDxk8sYzUJGUcFuimDThTtd6ENI36BLXalv0IdQUBRcFVq6LvgQLnRTBM1GFDRQsFQXauMl/T6ZU2yay4nWqf2DjJeYyS8xOUe56XT6jtgkCMI3Xdc/JBKJ7/i4VqtJDw8PrwzDkOzek06nSTabJX+jdrtNCoVCj2VZ+J8Zu9f2+/281+tpeJ93WAc5HA5hURTfjsfjR8RyHKc4YbF+v0+63S65NsTijTWe53W718DwIpPJxE/LEZcA+Agre+P3+1/CEfcRhq5Fe8Viq9VqxIJmAS+DweDn7XY7AbBOGLsUfQkWGwwGOgtadFrJE/Z9KBSi57AqSZICH3XmI53L5ZjOQZrTuegWolOp1Ai2+fXxeLTcRtsjbMZilUrlB6R6OdLPnduRtgRbYWn/Oxqe47+eP+GEpdmhZ7MZR+4kOzQvy/InQJ7QLFiaGa1pGmk2m3cDxqzQfDgcXm42m4+AHbFiaRQ9mUz0arXKLxaLI7mzzOjTVTqfz+uRSOTLbrfzfF7CVVsIBAKCz+e7CbbRaGRgVNDhgKi4g8kFAfrXJ49PJpNSNBrFGZQMe0GBwVlmXVGr1ZJh2qbEYjGhVCpxsNPILcIJD87ycLZHvIfvUeB2GqZ4xNIxC8ACK5piYUMEfAxoA9HkRl2I/g2L8eYBmgVtxtIQTW6YR/QfWMxyHHZC22GfK0a0JRaznWlZof81luaCtsVijnNpROObAa0Wi0XiFdvpdPCPp7kxjufxeNx1OUTD1RvR51dvRyzm+m0J0fBNSYGx1jP2Cewp+EHihKYBSrNb1nSkXbGQ5gper9dEVVWxXq+L5xvi1KVY2jm6XC7PWdCEAQu3uSMYscPhkIMJibFcLg3Yk5wb+loszSuaMGDxzk8xJ66t1vgNvwAAAABJRU5ErkJggg==';

export class DrawImagesManger {
  /**
   * Получение основной картинки для pdf
   * @param mat
   * @param width
   * @param height
   * @param upscale
   * @param returnResult
   */
  public static getFullImage(
    mat: OutMatrixType,
    width: number,
    height: number,
    upscale: boolean = false,
    returnResult: boolean = false,
  ) {
    const canvas = document.createElement('canvas');
    const c = canvas.getContext('2d')!;
    const cell = upscale ? 8 : 1;
    const w = width * cell;
    const h = height * cell;

    canvas.width = w;
    canvas.height = h;
    c.clearRect(0, 0, canvas.width, canvas.height);
    const { matrix } = mat;

    for (let i = 0; i < matrix.length; i++) {
      const xPos = (i % width) * cell;
      const yPos = Math.floor(i / width) * cell;

      const rect = matrix[i];
      c.fillStyle = `rgb(${rect.r}, ${rect.g}, ${rect.b})`;
      c.fillRect(xPos, yPos, cell, cell);
    }

    if (upscale) {
      c.fillStyle = 'rgba(255, 255, 255, 0.1)';
      c.fillRect(0, 0, w, h);

      const IDX = 2;
      const W = TILES.height;

      for (let opy = 0; opy < height; opy++) {
        for (let opx = 0; opx < width; opx++) {
          const px = opx * cell;
          const py = opy * cell;

          c.drawImage(TILES, IDX * W, 0, W, W, px, py, cell, cell);
        }
      }
    }

    if (!returnResult) {
      canvas.toBlob((blob) => {
        const userStore = $userStore.getState();

        $setUserStore({
          ...userStore,
          picture_file: blob,
          preview_picture_type: w > h ? 'wide' : 'tall',
        });
      });
    } else {
      return canvas.toDataURL('image/jpg');
    }
  }

  public static flipImage(img: HTMLImageElement, w: number, h: number) {
    const canvas = document.createElement('canvas');
    const c = canvas.getContext('2d')!;

    canvas.width = w;
    canvas.height = h;

    c.clearRect(0, 0, w, h);
    c.translate(w / 2, h / 2);
    c.rotate(Math.PI / 2);
    c.drawImage(img, -h / 2, -w / 2, h, w);

    return canvas.toDataURL('image/jpg');
  }

  /**
   * Картинка цветовой гаммы для pdf
   * @param set
   */
  public static getColorSetImg(set: ColorSet) {
    const canvas = document.createElement('canvas');
    const c = canvas.getContext('2d')!;
    let src = blackWhiteSetImg;
    const width = 188 * devicePixelRatio;
    const height = 48 * devicePixelRatio;
    canvas.width = width;
    canvas.height = height;

    switch (set) {
      case ColorSet.Sepia:
        src = sepiaSetImg;
        break;
      case ColorSet.PopArt:
        src = popArtSetImg;
    }

    const img = new Image();

    img.onload = () => {
      c.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        const userStore = $userStore.getState();
        $setUserStore({ ...userStore, colorSet_File: blob });
      });
    };

    img.src = src;
  }
}
