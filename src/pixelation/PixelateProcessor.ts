import { BlurPass } from '@/pixelation/filters/BlurPass.ts';
import { FilterPass, FramebufferDef } from '@/pixelation/filters/FilterPass.ts';
import { PresetPass } from '@/pixelation/filters/PresetPass.ts';
import { USMPass } from '@/pixelation/filters/USMPass.ts';
import {
  COLOR_QUOTA,
  ColorFilter,
  COLORS,
  ColorSet,
  ImageSize,
  SIZES,
} from '@/pixelation/PixelationTypes.ts';

export class PixelateProcessor {
  private readonly context: WebGLRenderingContext;

  private readonly size: [number, number];

  private readonly frameBuffers: FramebufferDef[];

  private readonly filters: FilterPass[];

  private readonly canvasSize: ImageSize;

  public constructor(
    context: WebGLRenderingContext,
    private readonly rawData: Uint8Array,
    size: ImageSize,
    private readonly colors: ColorSet | null,
    filter: ColorFilter,
    horizontal: boolean,
  ) {
    this.context = context;
    this.canvasSize = size;
    FilterPass.context = context;

    this.size = [...SIZES[size]];
    if (!horizontal) {
      this.size.reverse();
    }
    const [width, height] = this.size;

    // Два фреймбуффера для обработки
    this.frameBuffers = [
      FilterPass.buildFramebuffer(width, height, rawData), //
      FilterPass.buildFramebuffer(width, height),
    ];

    // Фильтры
    this.filters = [];
    if (colors !== null) {
      this.filters.push(new PresetPass(colors, filter));
    }

    switch (this.canvasSize) {
      case ImageSize.Small:
        this.filters.push(
          new USMPass(width, height, 3, 4), //
        );
        break;
      case ImageSize.Medium:
        this.filters.push(
          new USMPass(width, height, 4, 6), //
        );
        break;
      case ImageSize.Large:
        this.filters.push(
          new BlurPass(0.2, true, width, height),
          new BlurPass(0.2, false, width, height),
          new USMPass(width, height, 4, 8), //
        );
        break;

      default:
        break;
    }
  }

  public build(): Uint8Array {
    const GL = this.context;
    const [width, height] = this.size;
    let second = false;
    for (const pass of this.filters) {
      pass.draw(
        this.frameBuffers[second ? 1 : 0].texture,
        this.frameBuffers[second ? 0 : 1].fbo,
        width,
        height,
      );
      second = !second;
    }

    // Чтение результата
    const rawPixels = new Uint8Array(width * height * 4);
    GL.bindFramebuffer(GL.FRAMEBUFFER, this.frameBuffers[second ? 1 : 0].fbo);
    GL.readPixels(0, 0, width, height, GL.RGBA, GL.UNSIGNED_BYTE, rawPixels);
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);

    // Конвертация из RGBA в R-компонент
    const out = new Uint8Array(this.rawData.length);
    const count = this.colors !== null ? COLORS[this.colors].length : 0;
    const quota = Array<number>(count).fill(COLOR_QUOTA[this.canvasSize]);
    for (let i = 0; i < out.length; i++) {
      out[i] = rawPixels[i * 4];

      // Постеризация в указанные цвета
      if (count !== 0) {
        out[i] = Math.min(count - Math.floor((out[i] * count) / 255), count - 1);
        quota[out[i]]--;
      }
    }

    // Перераспределение цветов
    if (this.colors !== null) {
      this.realignByQuota(out, quota);
    }

    return out;
  }

  /**
   * Освобождение ресурсов
   */
  public dispose() {
    const GL = this.context;
    for (const fb of this.frameBuffers) {
      GL.deleteFramebuffer(fb.fbo);
      GL.deleteTexture(fb.texture);
    }
  }

  /**
   * Перераспределение цветов по квоте
   * @param data
   * @param quota
   * @private
   */
  private realignByQuota(data: Uint8Array, quota: number[]) {
    for (let colorIdx = 0; colorIdx < quota.length; colorIdx++) {
      // Если квота цвета исчерпана и ушла в минус
      if (quota[colorIdx] < 0) {
        // Собираем все позиции цвета и перемешиваем
        const offsets: number[] = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i] === colorIdx) {
            offsets.push(i);
          }
        }
        this.shuffleArray(offsets);

        // Заменяем другими доступными цветами - вверх и вниз по яркости
        const count = -quota[colorIdx];
        for (let i = 0; i < count; i++) {
          const pos = offsets.pop()!;
          let repl = colorIdx;
          for (let j = 1; j < 10; j++) {
            if (colorIdx + j < quota.length && quota[colorIdx + j] > 0) {
              repl = colorIdx + j;
              break;
            } else if (colorIdx - j >= 0 && quota[colorIdx - j] > 0) {
              repl = colorIdx - j;
              break;
            }
          }
          quota[repl]--;
          data[pos] = repl;
        }
      }
    }
  }

  /**
   * Перемешать массив
   * @param array
   */
  private shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
}
