import cursorImageSrc from '@/assets/images/main-canvas/cursor.png';
import normalImageSrc from '@/assets/images/main-canvas/img1.jpg';
import pixelImageSrc from '@/assets/images/main-canvas/img2.jpg';

export class MainCardCanvas {
  /**
   * Основной канвас
   * @private
   */
  private readonly canvas: HTMLCanvasElement | null;

  /**
   * Изображение обычное
   * @private
   */
  private readonly img1: HTMLImageElement;

  /**
   * Изображение пикселизированное
   * @private
   */
  private readonly img2: HTMLImageElement;

  /**
   * Картинка курсора
   * @private
   */
  private readonly cursorImg: HTMLImageElement;

  /**
   * Координата центра линии
   * @private
   */
  private lineX: number;

  /**
   * Позиция линии на момент касания
   * @private
   */
  private tempMouseX: number;

  /**
   * Флаг активности перемещения
   * @private
   */
  private isPressed: boolean;

  /**
   * Ширина для фикса ресайза на скрол на мобилке
   * @private
   */
  private windowWidth: number = 0;

  /**
   * Размер круга
   * @private
   */
  private circleSize: number;

  private readonly mouse: { x: number; y: number };

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.img1 = new Image();
    this.img2 = new Image();
    this.cursorImg = new Image();
    this.isPressed = false;
    this.mouse = {
      x: 0,
      y: 0,
    };
    this.draw();
    this.resize = this.resize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);

    window.addEventListener('resize', this.resize);
    window.addEventListener('pointermove', this.onMouseMove);
    window.addEventListener('pointerup', this.onMouseUp);
    window.addEventListener('pointerdown', this.onMouseDown);

    this.lineX = 30;
    this.circleSize = 50 * devicePixelRatio;
    this.tempMouseX = 0;

    this.img1.src = normalImageSrc;
    this.img2.src = pixelImageSrc;
    this.cursorImg.src = cursorImageSrc;

    // Костыль для подгрузки картинок
    this.img1.onload = () => {
      this.draw();
    };
    this.img2.onload = () => {
      this.draw();
    };
    this.cursorImg.onload = () => {
      this.draw();
    };
    this.resize();
  }

  /**
   * Отрисовка канваса
   * @private
   */
  private draw() {
    if (!this.canvas || !this.lineX || !this.circleSize) {
      return;
    }
    const c = this.canvas.getContext('2d')!;
    const { width, height } = this.canvas;
    const w = width;
    const h = height;

    c.clearRect(0, 0, w, h);

    // Левое обычное изображение
    c.save();
    c.beginPath();
    c.rect(0, 0, this.lineX, h);
    c.clip();
    c.drawImage(this.img1, 0, 0, width, height);
    c.restore();

    // Правое пиксилизированное изображение
    c.save();
    c.beginPath();
    c.rect(this.lineX, 0, w - this.lineX, h);
    c.clip();
    c.drawImage(this.img2, 0, 0, width, height);
    c.restore();

    // Вертикальная линия
    c.strokeStyle = '#3BA1FF';
    c.fillStyle = '#3BA1FF';
    const lineSize = 5;
    c.fillRect(this.lineX - lineSize / 2, 0, lineSize, h);

    // Круг
    c.beginPath();
    c.arc(this.lineX, h / 2, this.circleSize / 2, 0, Math.PI * 2);
    c.fill();

    // Курсор
    const cursorSize = this.circleSize * 0.75;
    c.drawImage(
      this.cursorImg,
      this.lineX - cursorSize / 2,
      height / 2 - cursorSize / 2,
      cursorSize,
      cursorSize,
    );
  }

  /**
   * Ресайз канваса
   */
  private readonly resize = () => {
    if (!this.canvas || window.innerWidth === this.windowWidth) {
      return;
    }
    this.windowWidth = window.innerWidth;

    const { width, height } = this.canvas.getBoundingClientRect();
    const dpi = window.devicePixelRatio;
    this.canvas.width = width * dpi;
    this.canvas.height = height * dpi;

    this.lineX = this.canvas.width * 0.65;
    const czDesk = 50 * devicePixelRatio;
    const czMobile = 60 * devicePixelRatio;
    this.circleSize = this.windowWidth < 1024 ? czMobile : czDesk;
    this.draw();
  };

  /**
   * Перемещение линии
   * @param e
   */
  private readonly onMouseMove = (e: PointerEvent) => {
    e.preventDefault();
    document.body.style.touchAction = 'none';

    this.updateMouse(e);
    if (this.isPressed) {
      const { x } = this.mouse;
      this.lineX = Math.max(0, Math.min(this.canvas!.width, x + this.tempMouseX));
    }

    this.draw();
  };

  /**
   * Изменение позиции мыши
   * @param e
   */
  private readonly updateMouse = (e: PointerEvent) => {
    const { left, top } = this.canvas!.getBoundingClientRect();
    const dpi = devicePixelRatio;
    this.mouse.x =
      Math.max(0, Math.min(e.clientX - left, this.canvas!.width / devicePixelRatio)) * dpi;
    this.mouse.y =
      Math.max(0, Math.min(e.clientY - top, this.canvas!.height / devicePixelRatio)) * dpi;
  };

  /**
   * Инит перемещения
   * @param e
   * @private
   */
  private onMouseDown(e: PointerEvent) {
    if (!this.canvas) {
      return;
    }

    this.updateMouse(e);

    const cz = this.circleSize / 2;
    const { x, y } = this.mouse;
    const { height } = this.canvas;

    if (x < this.lineX + cz && x > this.lineX - cz && y > height / 2 - cz && y < height / 2 + cz) {
      this.isPressed = true;
      document.body.style.touchAction = 'none';
      document.body.style.overflow = 'hidden';
    }

    this.tempMouseX = this.lineX - e.offsetX * devicePixelRatio;
  }

  /**
   * Сброс перемещения
   * @private
   */
  private onMouseUp(e: PointerEvent) {
    e.preventDefault();

    this.isPressed = false;
    document.body.style.touchAction = '';
    document.body.style.overflow = '';
  }

  /**
   * Сброс канваса
   */
  public dispose() {
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('pointermove', this.onMouseMove);
    window.removeEventListener('pointerup', this.onMouseUp);
    window.removeEventListener('pointerdown', this.onMouseDown);
  }
}
