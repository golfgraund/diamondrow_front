import { CropperState } from 'react-advanced-cropper';
import { DrawImagesManger } from '@/mosaic/DrawImagesManger';
import { MosaicManager, OutMatrixType } from '@/mosaic/MosaicManager';
import { createImageFromPalette } from '@/mosaic/pixelateImage';
import { pixelate } from '@/pixelation/Pixelation.ts';
import { ColorFilter, ColorSet, ImageSize, SIZES } from '@/pixelation/PixelationTypes.ts';
import { $setCropStatus } from '@/stores/ImgCropStatus';
import { $setUserStore, $userStore } from '@/stores/userStore';

export class FilterManager {
  /**
   * Хранилище матриц во время фильтра
   * @private
   */
  private static filtersMatrix: OutMatrixType[] = [];

  /**
   * Индекс выбранной матрицы в фильтах
   * @private
   */
  private static selectedMatrixIndex: number = 0;

  /**
   * Ориантация кропнутого изображения
   * @private
   */
  private static isHorizontal: boolean = true;

  /**
   * Кропнутое изображение
   * @private
   */
  private static outImgData: string = '';

  /**
   * Оригинальное изображение
   * @private
   */
  // private static sourceImgData: string = '';

  /**
   * Цветовая тема для мозаики
   * @private
   */
  private static colorSet: ColorSet = ColorSet.BlackAndWhite;

  /**
   * Размер мозаики
   * @private
   */
  private static imageSize: ImageSize = ImageSize.Medium;

  /**
   * Состояние кроппера
   * @private
   */
  private static cropState: CropperState | null = null;

  /**
   * Обрезанное изображение
   * @private
   */
  private static cropImg: HTMLImageElement;

  /**
   * Обрезанное изображение
   * @private
   */
  private static sourceImg: HTMLImageElement;

  /**
   * Обрезка картинки под выбранную область
   */
  public static async crop(
    imgData: string,
    sourceImgData: string,
    imageState: CropperState | null,
  ) {
    $setCropStatus(false);

    [this.cropImg, this.sourceImg] = await Promise.all([
      this.parseImage(imgData),
      this.parseImage(sourceImgData),
    ]);
    this.outImgData = imgData;
    // this.sourceImgData = sourceImgData;
    this.cropState = imageState;
    $setCropStatus(true);
  }

  public static getCropState() {
    return {
      result: this.cropImg,
      source: this.sourceImg,
      crop: this.cropState!,
    };
  }

  /**
   * Получение картинок для превью
   * @private
   */
  public static async generatePreviewImages() {
    if (!this.outImgData) {
      console.warn('Не загружено изображение');

      return;
    }

    const horizontal = this.isHorizontal;
    const height = horizontal ? SIZES[this.imageSize][1] : SIZES[this.imageSize][0];
    const width = horizontal ? SIZES[this.imageSize][0] : SIZES[this.imageSize][1];
    const srcs: string[] = await Promise.all(
      [
        ColorSet.BlackAndWhite, //
        ColorSet.Sepia,
        ColorSet.PopArt,
      ].map((colorSet) =>
        pixelate(this.cropImg, colorSet, this.imageSize, ColorFilter.Normal, horizontal).then(
          (buffer) => {
            const mat = createImageFromPalette(buffer, colorSet, this.imageSize, horizontal);

            return DrawImagesManger.getFullImage(mat, width, height, true, true)!;
          },
        ),
      ),
    );

    localStorage.setItem('preview-src', JSON.stringify(srcs));

    return srcs;
  }

  /**
   * Генерация изображений с разными фильтрами
   */
  public static async generateFilterImages(): Promise<string[]> {
    const horizontal = this.isHorizontal;
    const width = SIZES[this.imageSize][horizontal ? 0 : 1];
    const height = SIZES[this.imageSize][horizontal ? 1 : 0];
    const prefs = [
      ColorFilter.Normal,
      ColorFilter.Lighter,
      ColorFilter.Lightest,
      ColorFilter.Darker,
      ColorFilter.Darkest,
    ];

    const pixels = await Promise.all(
      prefs.map((filter) =>
        pixelate(this.cropImg, this.colorSet, this.imageSize, filter, horizontal),
      ),
    );
    const matrices = pixels.map((px) =>
      createImageFromPalette(px, this.colorSet, this.imageSize, horizontal),
    );

    const images = matrices.map(
      (mat) => DrawImagesManger.getFullImage(mat, width, height, true, true)!,
    );

    this.filtersMatrix = matrices.map((mat) =>
      horizontal ? this.transposeHorizontalMatrix(mat, this.imageSize) : mat,
    );

    return images;
  }

  /**
   * Генерация изображений для pdf
   * @private
   */
  public static generatePdfImages() {
    const mat = this.filtersMatrix[this.selectedMatrixIndex];
    const height = SIZES[this.imageSize][0];
    const width = SIZES[this.imageSize][1];

    const blocks = MosaicManager.parseMatrix(mat, width);
    const userStore = $userStore.getState();
    $setUserStore({ ...userStore, matrix_progress: blocks });

    DrawImagesManger.getFullImage(mat, width, height, true, false);
    DrawImagesManger.getColorSetImg(this.colorSet);
  }

  public static getImage() {
    return this.outImgData;
  }

  public static getImageSize() {
    return this.imageSize;
  }

  /**
   * Установка размера выходной картины
   * @param size
   */
  public static setImageSize(size: ImageSize) {
    this.imageSize = size;
  }

  /**
   * Получение выбранной матрицы
   * @param index
   */
  public static setActiveMatrix(index: number) {
    this.selectedMatrixIndex = index;
  }

  /**
   * Установка ориентации кропа
   * @param val
   */
  public static setHorizontal(val: boolean) {
    this.isHorizontal = val;
  }

  public static setColorSet(set: ColorSet) {
    this.colorSet = set;
  }

  private static parseImage(data: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', () => reject());
      img.src = data;
    });
  }

  private static transposeHorizontalMatrix(mat: OutMatrixType, size: ImageSize): OutMatrixType {
    const result: OutMatrixType = {
      colors: [...mat.colors],
      matrix: [],
    };

    const [sw, tw] = SIZES[size];

    for (let i = 0; i < mat.matrix.length; i++) {
      const cell = mat.matrix[i];
      const origX = i % sw;
      const origY = (i - origX) / sw;
      const tgX = tw - origY - 1;
      const tgY = origX;
      const j = tgY * tw + tgX;
      result.matrix[j] = cell;
    }

    return result;
  }
}
