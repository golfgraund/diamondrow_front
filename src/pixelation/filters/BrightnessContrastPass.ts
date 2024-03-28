import { FilterPass, UniformList } from '@/pixelation/filters/FilterPass.ts';

const CODE = `
  uniform float uContrast;
  uniform float uBrightness;

  void main() {
    float value = source();
    value = (value - 0.5) * uContrast + 0.5 + uBrightness;
    emit(value);
  }
`;

export class BrightnessContrastPass extends FilterPass {
  public constructor(
    private readonly brightness: number = 0,
    private readonly contrast: number = 1,
  ) {
    super(CODE);
  }

  protected bind(GL: WebGLRenderingContext, uniforms: UniformList) {
    GL.uniform1f(uniforms.uBrightness, this.brightness);
    GL.uniform1f(uniforms.uContrast, this.contrast);
  }
}
