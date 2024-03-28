import { BlurPass } from '@/pixelation/filters/BlurPass.ts';
import { CopyPass } from '@/pixelation/filters/CopyPass.ts';
import { FilterPass, FramebufferDef, UniformList } from '@/pixelation/filters/FilterPass.ts';

const CODE = `
  uniform sampler2D uBlurred;
  uniform float uPower;

  float sourceBlurred() {
    return texture2D(uBlurred, vUv).r;
  }

  void main() {
    emit(mix(sourceBlurred(), source(), 1.0 + uPower));
  }
`;

export class USMPass extends FilterPass {
  private readonly blurVertical: BlurPass;

  private readonly blurHorizontal: BlurPass;

  private readonly copy: CopyPass;

  private readonly buffers: FramebufferDef[];

  public constructor(
    width: number,
    height: number,
    private readonly power: number,
    private readonly blurPower: number = 1,
  ) {
    super(CODE);
    this.blurVertical = new BlurPass(1, true, width, height);
    this.blurHorizontal = new BlurPass(1, false, width, height);
    this.copy = new CopyPass();

    this.buffers = [
      FilterPass.buildFramebuffer(width, height),
      FilterPass.buildFramebuffer(width, height),
    ];
  }

  protected bind(GL: WebGLRenderingContext, uniforms: UniformList) {
    GL.activeTexture(GL.TEXTURE1);
    GL.bindTexture(GL.TEXTURE_2D, this.buffers[0].texture);
    GL.uniform1i(uniforms.uBlurred, 1);
    GL.uniform1f(uniforms.uPower, this.power);
  }

  public draw(source: WebGLTexture, target: WebGLFramebuffer, width: number, height: number) {
    this.copy.draw(source, this.buffers[0].fbo, width, height);
    for (let i = 0; i < this.blurPower; i++) {
      this.blurVertical.draw(this.buffers[0].texture, this.buffers[1].fbo, width, height);
      this.blurHorizontal.draw(this.buffers[1].texture, this.buffers[0].fbo, width, height);
    }

    super.draw(source, target, width, height);
  }
}
