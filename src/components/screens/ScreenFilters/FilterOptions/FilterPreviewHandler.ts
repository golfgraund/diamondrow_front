import { CropperState } from 'react-advanced-cropper';

export class FilterPreviewHandler {
  private readonly images: HTMLImageElement[];

  private readonly canvasSize: [number, number];

  private readonly frameSize: [number, number];

  private readonly sourceSize: [number, number, number, number];

  private sourceAngle: number = 0;

  private frame: number;

  public constructor(
    private readonly canvas: HTMLCanvasElement,
    imageSources: string[],
    private readonly source: HTMLImageElement,
    private readonly cropState: CropperState,
  ) {
    this.frameSize = [1, 1];
    this.canvasSize = [1, 1];
    this.sourceSize = [0, 0, 100, 100];
    this.frame = 0;

    this.images = imageSources.map((src) => {
      const img = new Image();
      img.onload = () => {
        this.draw();
      };
      img.src = src;

      return img;
    });

    this.handleResize();
    this.draw();
  }

  public setFrame(index: number) {
    this.frame = index;
    this.draw();
  }

  public dispose() {}

  private handleResize() {
    const { width, height } = this.canvas.getBoundingClientRect();
    const dpi = window.devicePixelRatio;
    this.canvas.width = width * dpi;
    this.canvas.height = height * dpi;

    const state = this.cropState.coordinates!;
    const scale = 0.95;
    const aspect = 1.0 / (state.width / state.height);
    let sizeX = width * scale;
    let sizeY = height * scale;

    if (aspect > 1) {
      sizeX /= aspect;
    } else {
      sizeY *= aspect;
    }

    const crop = this.cropState.coordinates!;
    const angle = (this.cropState.transforms.rotate / 90) % 4;
    const [iw, ih] = [this.source.width, this.source.height];
    const [ox, oy] = [crop.left, crop.top];

    const factor = sizeX / crop.width;
    let sx = width / 2 - sizeX / 2;
    let sy = height / 2 - sizeY / 2;
    const sw = iw * factor;
    const sh = ih * factor;

    const [rw, rh] = angle % 2 === 1 ? [sh, sw] : [sw, sh];

    sx += angle === 1 || angle === 2 ? rw : 0;
    sy += angle === 2 || angle === 3 ? rh : 0;

    this.sourceSize[0] = sx - ox * factor;
    this.sourceSize[1] = sy - oy * factor;
    this.sourceSize[2] = iw * factor;
    this.sourceSize[3] = ih * factor;
    this.sourceAngle = angle;

    this.canvasSize[0] = width;
    this.canvasSize[1] = height;
    this.frameSize[0] = sizeX;
    this.frameSize[1] = sizeY;
    this.draw();
  }

  private draw() {
    const g = this.canvas.getContext('2d')!;
    const dpi = window.devicePixelRatio;
    const [w, h] = this.canvasSize;
    const [fw, fh] = this.frameSize;

    g.resetTransform();
    g.scale(dpi, dpi);
    g.clearRect(0, 0, w, h);

    g.save();
    const [sx, sy, sw, sh] = this.sourceSize;
    const sr = Math.PI * 0.5 * this.sourceAngle;
    g.translate(sx, sy);
    g.rotate(sr);
    g.drawImage(this.source, 0, 0, sw, sh);
    g.restore();

    g.fillStyle = 'rgba(0, 0, 0, 0.4)';
    g.fillRect(0, 0, w, h);

    const result = this.images ? this.images[this.frame] : null;
    if (result && result.complete) {
      g.save();
      g.imageSmoothingEnabled = false;
      g.drawImage(
        result,
        Math.floor(w / 2 - fw / 2),
        Math.floor(h / 2 - fh / 2),
        Math.floor(fw),
        Math.floor(fh),
      );

      g.imageSmoothingEnabled = true;
      g.strokeStyle = '#fff';
      g.lineWidth = 2;
      g.strokeRect(
        Math.floor(w / 2 - fw / 2),
        Math.floor(h / 2 - fh / 2),
        Math.floor(fw),
        Math.floor(fh),
      );

      g.restore();
    }
  }
}
