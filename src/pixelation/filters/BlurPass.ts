import { FilterPass, UniformList } from '@/pixelation/filters/FilterPass.ts';

const CODE = `
  uniform vec2 uDirection;
  uniform vec2 uSize;

  void main() {
    float color = 0.0;
    
    vec2 off1 = vec2(1.411764705882353) * uDirection;
    vec2 off2 = vec2(3.2941176470588234) * uDirection;
    vec2 off3 = vec2(5.176470588235294) * uDirection;
    color += source() * 0.1964825501511404;
    color += sourceOff(off1 / uSize)  * 0.2969069646728344;
    color += sourceOff(-off1 / uSize) * 0.2969069646728344;
    color += sourceOff(off2 / uSize)  * 0.09447039785044732;
    color += sourceOff(-off2 / uSize) * 0.09447039785044732;
    color += sourceOff(off3 / uSize)  * 0.010381362401148057;
    color += sourceOff(-off3 / uSize) * 0.010381362401148057;
 
    emit(color);
  }
`;

export class BlurPass extends FilterPass {
  public constructor(
    private readonly power: number,
    private readonly vertical: boolean,
    private readonly width: number,
    private readonly height: number,
  ) {
    super(CODE);
  }

  protected bind(GL: WebGLRenderingContext, uniforms: UniformList) {
    GL.uniform2f(
      uniforms.uDirection,
      !this.vertical ? this.power : 0,
      this.vertical ? this.power : 0,
    );
    GL.uniform2f(uniforms.uSize, this.width, this.height);
  }
}
