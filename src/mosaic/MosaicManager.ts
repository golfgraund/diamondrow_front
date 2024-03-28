import axios from 'axios';
import * as Color from 'color';
import { roundRect } from '@/helpers/CanvasPolyfills';
import { COLORS, ColorSet } from '@/pixelation/PixelationTypes.ts';

export type RGB = {
  r: number;
  g: number;
  b: number;
  filled: boolean;
  index: number;
};

export type OutMatrixType = {
  matrix: RGB[];
  colors: number[][];
};

type RestColor = {
  color: number[];
  index: number;
};

const checkedWhiteColors: [number, number, number][][] = [
  [
    [255, 255, 255],
    [236, 236, 236],
    [249, 249, 249],
    [245, 245, 245],
  ],
  [
    [246, 246, 246],
    [220, 220, 220],
    [239, 239, 239],
    [228, 228, 228],
  ],
  [
    [238, 238, 238],
    [198, 198, 198],
    [224, 224, 224],
    [209, 209, 209],
  ],
  [
    [156, 156, 156],
    [88, 88, 88],
    [136, 136, 136],
    [108, 108, 108],
  ],
  [
    [108, 108, 108],
    [50, 50, 50],
    [86, 86, 86],
    [66, 66, 66],
  ],
  [
    [62, 61, 61],
    [0, 0, 0],
    [51, 51, 51],
    [30, 30, 30],
  ],
];

export class MosaicManager {
  /**
   * Разбитая на блоки матрица
   * @private
   */
  private static blocks: RGB[][] = [];

  /**
   * Основной канвас
   * @private
   */
  private static canvas: HTMLCanvasElement;

  /**
   * Кол-ва ячеек по ширине
   * @private
   */
  private static readonly bw: number = 10;

  /**
   * Кол-ва ячеек по высоте
   * @private
   */
  private static readonly bh: number = 10;

  /**
   * Ширина канваса
   * @private
   */
  private static zoneW: number = 418;

  /**
   * Высота канваса
   * @private
   */
  private static zoneH: number = 532;

  /**
   * Отступ от индексов строк/столбцов
   * @private
   */
  private static readonly numbersShift: number = 32;

  /**
   * Отступ от блока с выбором активных цветов
   * @private
   */
  private static readonly colorsShift: number = 52;

  /**
   * Цвета мозаики
   * @private
   */
  private static colors: number[][] = [];

  /**
   * Набор букв для индекса цвета
   * @private
   */
  private static readonly colorsSymbols: string = 'ABCDEVT';

  /**
   * Оставшиеся цвета в блоке
   * @private
   */
  private static activeColors: number[] = [];

  /**
   * Выбранные цвета в блоке
   * @private
   */
  private static focusColors: number[] = [];

  /**
   * Активный блок
   * @private
   */
  private static activeBlock: RGB[];

  /**
   * Индекс активного блока
   * @private
   */
  private static activeBlockIndex: number = 0;

  /**
   * Кол-во ячеек в ширину на крайних блоках
   * @private
   */
  private static tempBw: number = 0;

  /**
   * Индексы элементов для шага назад
   * @private
   */
  private static undoIndexes: number[] = [];

  /**
   * Интервал для сохранения
   * @private
   */
  private static saveInterval: any = 0;

  /**
   * Цветовая гамма
   * @private
   */
  private static colorSet: ColorSet = ColorSet.BlackAndWhite;

  /**
   * Создание канваса
   * @param canvas
   * @param slug
   * @param successCb
   * @param errorCb
   */
  public static async init(
    canvas: HTMLCanvasElement,
    slug: string,
    successCb: (src: string) => void,
    errorCb: () => void,
  ) {
    this.canvas = canvas;
    this.resize();

    this.onClick = this.onClick.bind(this);
    this.canvas.addEventListener('click', this.onClick);

    await axios
      .get(
        `${import.meta.env.VITE_APP_URL_SAVE}/${slug}` ||
          `http://localhost:3000/api/puzzle/${slug}`,
      )
      .then((res) => {
        this.blocks = JSON.parse(JSON.parse(res.data.matrix_progress));
        this.activeBlockIndex = 0;
        successCb(res.data.image.src);

        let color: RGB | null = null;
        for (let i = Math.floor(this.blocks.length / 2); i < this.blocks.length; i++) {
          const b = this.blocks[i];

          for (let j = 0; j < b.length; j++) {
            const c = b[j];
            if (c.g !== 255 && c.g !== 0) {
              color = c;
              break;
            }
          }

          if (color) {
            break;
          }
        }

        COLORS.forEach((colorSet, i) => {
          colorSet.forEach((c) => {
            const r = c[0];
            const g = c[1];
            const b = c[2];

            if (r === color!.r && g === color!.g && b === color!.b) {
              this.colorSet = i;
            }
          });
        });

        this.colors = COLORS[this.colorSet];

        this.setActiveBlock(0, true);
        this.saveInterval = setInterval(() => {
          this.saveChanges();
        }, 3000);
      })
      .catch(() => {
        errorCb();
      });
  }

  /**
   * Перевод матрицы в блоки
   * @param outMatrix
   * @param w
   */
  public static parseMatrix(outMatrix: OutMatrixType, w: number) {
    const { matrix, colors } = outMatrix;

    this.blocks = [];
    this.colors = colors;

    for (let i = 0; i < colors.length; i++) {
      this.focusColors.push(i);
    }

    // Разбивка на строки
    const rows: RGB[][] = [];
    for (let i = 0; i < matrix.length; i++) {
      const rowI = Math.floor(i / w);

      if (!rows[rowI]) {
        rows[rowI] = [];
      }
      const item = matrix[i];
      rows[rowI].push(item);
    }

    // Разбивка на блоки
    for (let i = 0; i < rows.length; i++) {
      const rowW = Math.ceil(rows[i].length / this.bw) * this.bw;
      for (let j = 0; j < rowW; j++) {
        const xIndex = Math.floor(j / this.bw);
        const yIndex = Math.floor(i / this.bh);
        const xAmount = Math.ceil(w / this.bw);
        const blockI = xIndex + yIndex * xAmount;

        if (!this.blocks[blockI]) {
          this.blocks[blockI] = [];
        }

        const el = rows[i][j];
        const elToPush = el ?? '';
        this.blocks[blockI].push(elToPush);
      }
    }

    const fullLength = this.blocks[0].length;

    this.blocks.forEach((b, i) => {
      if (b.length < fullLength) {
        const emptyArr = new Array(fullLength - b.length).fill('');
        this.blocks[i] = b.concat(emptyArr);
      }
    });

    return this.blocks;
  }

  /**
   * Установка активного блока
   * @param index
   * @param init
   */
  public static setActiveBlock(index: number, init = false) {
    if (!init) {
      this.saveChanges();
    }
    this.activeBlock = this.blocks[index];
    this.activeBlockIndex = index;
    this.undoIndexes = [];
    this.activeColors = [];
    for (let i = 0; i < this.activeBlock.length; i++) {
      if (!this.activeBlock[i]) {
        continue;
      }
      const curColor = this.activeBlock[i].index;
      const finded = this.activeColors.find((el) => el === curColor);

      if (finded === undefined) {
        this.activeColors.push(curColor);
      }
    }
    this.focusColors = this.activeColors;

    this.draw();
  }

  /**
   * Отрисовка
   * @private
   */
  private static draw(findLength?: boolean) {
    if (this.canvas && this.blocks.length > 0) {
      const c = this.canvas.getContext('2d')!;
      const dpi = window.devicePixelRatio;

      const w = this.canvas.width;
      const h = this.canvas.height;

      const block = this.activeBlock;

      c.clearRect(0, 0, w, h);
      const rw = (this.zoneW / this.bw) * dpi;
      const rh = (this.zoneH / this.bh) * dpi;

      // Отсутпы для зоны с мозаикой
      const zoneShift = this.numbersShift * dpi;
      const zoneTopShift = (this.numbersShift + this.colorsShift) * dpi;

      // Текущие цвета мозаики
      const shiftX = w / 2 - (this.activeColors.length * (rw + 12)) / 2;

      const restColors: RestColor[] = [];

      // Фильтрация для оставшихся цветов в меню
      for (let i = 0; i < this.activeColors.length; i++) {
        const color = this.colors[this.activeColors[i]];
        restColors.push({
          color,
          index: this.activeColors[i],
        });
      }
      restColors.sort((a, b) => a.index - b.index);

      const sTextSize = window.innerWidth < 600 ? 10 * dpi : 12 * dpi;
      const mTextSize = window.innerWidth < 600 ? 10 * dpi : 14 * dpi;
      const lTextSize = window.innerWidth < 600 ? 18 * dpi : 20 * dpi;

      // Отрисовка меню с оставшимися цветами
      for (let index = 0; index < restColors.length; index++) {
        const rest = restColors[index];

        if (!rest.color) {
          continue;
        }
        const { color } = rest;
        const r = color[0];
        const g = color[1];
        const b = color[2];

        const isFocus = this.focusColors.find((colorIndex) => colorIndex === rest.index);
        const isWhite = r === 255 && g === 255 && b === 255;

        c.fillStyle =
          isFocus || isFocus === 0 ? `rgb(${r},${g}, ${b})` : `rgba(${r},${g}, ${b}, 0.2)`;

        c.beginPath();
        if (isWhite) {
          c.strokeStyle = isFocus || isFocus === 0 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)';
          roundRect(c, shiftX + (rw + 12) * index, 2, rw, rh, 3 * dpi, true, true);
        } else {
          roundRect(c, shiftX + (rw + 12) * index, 2, rw, rh, 3 * dpi, true, false);
        }
        c.fill();

        const textBrightLimit = 170;
        const textColor =
          r >= textBrightLimit && g >= textBrightLimit && b >= textBrightLimit
            ? '0,0,0'
            : '255,255,255';
        const textAlpha = isFocus || isFocus === 0 ? '1' : '0.2';
        c.fillStyle = `rgba(${textColor},${textAlpha})`;
        c.font = `700 ${lTextSize}px Nunito`;
        c.fillText(
          this.colorsSymbols[rest.index],
          shiftX + (rw + 12) * index + 4 * dpi,
          rh - 4 * dpi,
        );
      }

      const isCross = this.activeColors.length !== this.focusColors.length;

      if (isCross) {
        // Отрисовка крестика
        c.fillStyle = '#787878';
        const crossX = shiftX + (rw + 12) * this.activeColors.length;
        const crossW = rw * 0.7;
        c.save();
        c.translate(crossX + crossW / 2, rh / 2);
        c.rotate(Math.PI / 4);
        c.beginPath();
        roundRect(c, -crossW / 2 + 1.1 * dpi, 0, crossW, 3 * dpi, 1.5 * dpi, true, false);
        c.fill();
        c.closePath();
        c.rotate(-Math.PI / 2);
        c.beginPath();
        roundRect(c, -crossW / 2 - 1.1 * dpi, 0, crossW, 3 * dpi, 1.5 * dpi, true, false);
        c.fill();
        c.closePath();
        c.restore();
      }

      // Индексы столбцов
      c.fillStyle = '#787878';
      for (let i = 0; i < this.bw; i++) {
        c.font = `500 ${sTextSize}px Nunito`;
        const shiftFactor = window.innerWidth < 600 ? 1.33 : 1.2;
        c.fillText(
          `${i + 1}`,
          rw * shiftFactor + rw * i,
          (this.colorsShift + this.numbersShift / 2) * dpi,
        );
        c.fillText(`${i + 1}`, rw * shiftFactor + rw * i, h - zoneShift / 2 + 7 * dpi);
      }

      // Индексы строк
      for (let i = 0; i < this.bh; i++) {
        const shiftFactor = window.innerWidth < 600 ? 1.7 : 1.5;
        c.fillText(
          `${i + 1}`,
          zoneShift / 2 - 5 * dpi,
          rh * shiftFactor + rh * i + this.colorsShift * dpi,
        );
        c.fillText(
          `${i + 1}`,
          w - zoneShift / 2 - 5 * dpi,
          rh * 1.5 + rh * i + this.colorsShift * dpi,
        );
      }

      c.strokeStyle = 'white';
      let dynamicIndex = 1;

      // Заполнение квадратов
      for (let i = 0; i < block.length; i++) {
        const { r, g, b, index, filled } = block[i];

        if (findLength) {
          const count = (Math.floor(i / this.bh) * rw + zoneShift - this.numbersShift) / rw;
          if (count > this.tempBw) {
            this.tempBw = count + 1;
          }
        }

        const cgap = 2;
        const cw = rw - cgap * 2;
        const ch = rh - cgap * 2;
        const xPos = (i % this.bw) * rw + zoneShift + cgap;
        const yPos = Math.floor(i / this.bw) * rh + zoneTopShift + cgap;

        if (!block[i]) {
          dynamicIndex = 1;
          c.fillStyle = 'rgba(147,147,147,0.4)';
          c.strokeStyle = 'rgba(255,255,255,0.4)';
          c.fillRect(xPos, yPos, cw, ch);
          c.strokeRect(xPos, yPos, cw, ch);

          c.save();
          c.translate(xPos + cw / 2, yPos + ch / 2);
          c.rotate(Math.PI / 4);
          c.fillStyle = 'red';
          const gap = 4 * dpi;
          const crossW = cw - gap * 2;
          const crossH = 3 * dpi;
          c.fillStyle = 'white';
          roundRect(c, -cw / 2 + gap, -crossH / 2, crossW, crossH, 2 * dpi, true);

          c.rotate(-Math.PI / 2);
          roundRect(c, -cw / 2 + gap, -crossH / 2, crossW, crossH, 2 * dpi, true);

          c.restore();
          continue;
        }

        const isFocus = this.focusColors.find((colorIndex) => colorIndex === index);
        const isExist = this.activeColors.find((colorsIndex) => colorsIndex === index);

        if (!filled) {
          // Квадраты
          c.fillStyle =
            isFocus || isFocus === 0 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b}, 0.7)`;
          c.fillRect(xPos, yPos, cw, ch);

          if (index === 0) {
            c.strokeStyle = '#eee';
            c.strokeRect(xPos, yPos, cw, ch);
            c.strokeStyle = 'transparent';
          }
        } else {
          c.save();
          c.beginPath();
          c.rect(xPos, yPos, cw, ch);
          c.clip();

          const innerRectSizeX = cw / 2;
          const innerRectSizeY = ch / 2;

          c.translate(xPos + cw / 2, yPos + ch / 2);
          c.rotate(Math.PI / 4);
          const opacity = (isFocus || isFocus === 0) && (isExist || isExist === 0) ? 1 : 0.5;
          const baseColor = Color.rgb(
            (r - 255) * 0.8 + 255,
            (g - 255) * 0.8 + 255,
            (b - 255) * 0.8 + 255,
          ).alpha(opacity);
          let checkedColor1 = baseColor.darken(0.15).toString(); // `rgba(${r + 39},${g + 39},${b + 14},${opacity})`;
          let checkedColor2 = baseColor.darken(0.35).toString(); // `rgba(${r - 17},${g - 19},${b - 22},${opacity})`;
          let checkedColor3 = baseColor.darken(0.05).toString(); // `rgba(${r + 17},${g + 11},${b + 5},${opacity})`;
          let checkedColor4 = baseColor.darken(0.25).toString(); // `rgba(${r},${g},${b},${opacity})`;

          if (this.colorSet === ColorSet.BlackAndWhite) {
            const col = checkedWhiteColors[index];
            checkedColor1 = `rgba(${col[0][0]},${col[0][1]},${col[0][2]},${opacity})`;
            checkedColor2 = `rgba(${col[1][0]},${col[1][1]},${col[1][2]},${opacity})`;
            checkedColor3 = `rgba(${col[2][0]},${col[2][1]},${col[2][2]},${opacity})`;
            checkedColor4 = `rgba(${col[3][0]},${col[3][1]},${col[3][2]},${opacity})`;
          }

          c.fillStyle = checkedColor1;
          c.fillRect(-innerRectSizeX / 2, -innerRectSizeY / 2, innerRectSizeX, innerRectSizeY);

          c.fillStyle = checkedColor2;
          c.fillRect(-innerRectSizeX / 2, innerRectSizeY / 2, innerRectSizeX, innerRectSizeY);
          c.fillRect(-innerRectSizeX * 1.5, -innerRectSizeY / 2, innerRectSizeX, innerRectSizeY);

          c.fillStyle = checkedColor3;
          c.fillRect(-innerRectSizeX / 2, -innerRectSizeY * 1.5, innerRectSizeX, innerRectSizeY);
          c.fillRect(innerRectSizeX / 2, -innerRectSizeY / 2, innerRectSizeX, innerRectSizeY);

          c.fillStyle = checkedColor4;
          c.fillRect(-innerRectSizeX * 1.5, -innerRectSizeY * 1.5, innerRectSizeX, innerRectSizeY);
          c.fillRect(innerRectSizeX * 0.5, innerRectSizeY * 0.5, innerRectSizeX, innerRectSizeY);
          c.fillRect(-innerRectSizeX * 1.5, innerRectSizeY * 0.5, innerRectSizeX, innerRectSizeY);
          c.fillRect(innerRectSizeX * 0.5, -innerRectSizeY * 1.5, innerRectSizeX, innerRectSizeY);

          c.closePath();
          c.restore();
        }

        // Обводка
        c.lineWidth = 1;
        c.strokeRect(xPos, yPos, cw, ch);

        // Текст на квадрате
        if (!filled) {
          const brightColorLimit = 170;
          const textColor =
            r >= brightColorLimit && g >= brightColorLimit && b >= brightColorLimit
              ? '0,0,0'
              : '255,255,255';
          const textAlpha = isFocus || isFocus === 0 ? '1' : '0.2';
          c.fillStyle = `rgba(${textColor},${textAlpha})`;
          c.font = `500 ${mTextSize}px Nunito`;
          const indexShift = window.innerWidth < 600 ? 8 * dpi : 12 * dpi;
          const textXShift = Math.floor(Math.log10(dynamicIndex)) * 8;
          c.fillText(
            `${dynamicIndex}`,
            xPos + cw - indexShift - textXShift,
            yPos + indexShift + dpi,
          );

          c.font = `900 ${lTextSize}px Nunito`;
          c.fillText(`${this.colorsSymbols[index]}`, xPos + 4 * dpi, yPos + ch - 5 * dpi);
        }

        const indexLimit = this.bw;

        // Номер квадрата
        if (
          !block[i + 1] ||
          block[i + 1].r !== r ||
          block[i + 1].g !== g ||
          block[i + 1].b !== b ||
          i % indexLimit === indexLimit - 1
        ) {
          dynamicIndex = 1;
        } else {
          dynamicIndex++;
        }
      }
    }
  }

  /**
   * Евенты по клику
   * @param e
   * @private
   */
  private static onClick(e: MouseEvent) {
    const w = this.canvas.width;
    // const h = this.canvas.height;
    const x = e.offsetX * devicePixelRatio;
    const y = e.offsetY * devicePixelRatio;
    const rw = (this.zoneW / this.bw) * devicePixelRatio;
    const rh = (this.zoneH / this.bh) * devicePixelRatio;

    const shiftX = w / 2 - (this.activeColors.length * (rw + 12)) / 2;

    // Заполние мозаики
    const zoneTopShift = (this.numbersShift + this.colorsShift) * devicePixelRatio;
    const block = this.activeBlock;
    for (let i = 0; i < block.length; i++) {
      const withEmpty = block.length < this.bh * this.bw;

      const xPos = withEmpty
        ? Math.floor(i / this.bh) * rw + this.numbersShift * devicePixelRatio
        : (i % this.bw) * rw + this.numbersShift * devicePixelRatio;
      const yPos = withEmpty
        ? (i % this.bh) * rh + zoneTopShift
        : Math.floor(i / this.bw) * rh + zoneTopShift;

      if (x > xPos && x < xPos + rw && y > yPos && y < yPos + rh) {
        const { index } = this.activeBlock[i];
        const isFocus = this.focusColors.find((colorIndex) => colorIndex === index);
        if (isFocus || isFocus === 0) {
          this.activeBlock[i].filled = !this.activeBlock[i].filled;
          this.undoIndexes.push(i);
        }
      }
    }

    this.activeColors = [];

    for (let i = 0; i < this.activeBlock.length; i++) {
      const el = this.activeBlock[i];
      if (!el) {
        continue;
      }
      const colorIndex = el.index;

      const isExist = this.activeColors.find((cI) => cI === colorIndex);

      if (isExist || isExist === 0) {
        /* empty */
      } else {
        this.activeColors.push(colorIndex);
      }
    }

    this.activeColors.sort((a, b) => a - b);

    // Смена активных цветов
    for (let index = 0; index < this.activeColors.length + 1; index++) {
      const color = this.activeColors[index];
      if (y < rh && y > 0 && x > shiftX && x < w + rw - shiftX) {
        const rx = (rw + 12) * index;

        if (x > shiftX + rx && x < shiftX + rx + rw) {
          if (this.activeColors.sort().join('') === this.focusColors.sort().join('')) {
            this.focusColors = [color];
          } else {
            const isExist = this.focusColors.find((colorIndex) => colorIndex === color);
            if (isExist || isExist === 0) {
              this.focusColors = this.focusColors.filter((colorIndex) => colorIndex !== color);
            } else {
              this.focusColors.push(color);
            }
          }

          if (index === this.activeColors.length || this.focusColors.length === 0) {
            this.focusColors = this.activeColors;
          }
        }
      }
    }

    this.draw();
  }

  private static resize() {
    const dpi = window.devicePixelRatio;
    const numberShift = this.numbersShift * 2;
    const { width } = this.canvas.getBoundingClientRect();

    const aspect = 380 / 380;
    this.zoneW = width - 32;
    this.zoneH = this.zoneW / aspect;

    const w = this.zoneW + numberShift;
    const h = this.zoneH + numberShift + this.colorsShift;
    this.canvas.width = w * dpi;
    this.canvas.height = h * dpi;

    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
  }

  /**
   * Получение кол-ва блоков для пагинации
   */
  public static getBlocksAmount() {
    return this.blocks.length;
  }

  /**
   * Сброс прогресса для текущего блока
   */
  public static clearBlock() {
    if (this.activeBlock) {
      this.activeBlock.forEach((el) => {
        if (el) {
          el.filled = false;
        }
      });
      this.undoIndexes = [];

      this.draw();
    }
  }

  /**
   * Отменить последний шаг
   */
  public static undo() {
    if (this.undoIndexes.length > 0) {
      const idx = this.undoIndexes[this.undoIndexes.length - 1];
      this.activeBlock[idx].filled = !this.activeBlock[idx].filled;
      this.undoIndexes.pop();
      this.draw();
    }
  }

  private static saveChanges() {
    if (!this.activeBlock) {
      return;
    }

    const url =
      `${import.meta.env.VITE_APP_URL_SAVE}/update` || 'http://localhost:3000/api/puzzle/update';
    const slug = localStorage.getItem('slug');
    const data = new FormData();
    data.append('slug', slug!);
    data.append('matrix_progress', JSON.stringify(this.activeBlock));
    data.append('sector_index', this.activeBlockIndex.toString());

    axios.post(url, data).catch((e) => console.debug(e));
  }

  /**
   * Получение матрицы
   */
  public static getMatrix() {
    return this.blocks;
  }

  /**
   * Очищение ресурсов
   */
  public static dispose() {
    this.canvas.removeEventListener('click', this.onClick);
    clearInterval(this.saveInterval);
  }
}
