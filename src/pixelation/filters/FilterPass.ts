function cyrb53(str: string, seed: number = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

export type UniformList = { [key: string]: WebGLUniformLocation };

export interface Shader {
  program: WebGLProgram;
  uniforms: UniformList;
}

export interface FramebufferDef {
  fbo: WebGLFramebuffer;
  texture: WebGLTexture;
}

const VERTEX_CODE = `
  precision highp float;
  attribute vec2 position;
  
  varying vec2 vUv;
  
  void main() {
    vUv = position;
    gl_Position = vec4(position * 2.0 - 1.0, 0.0, 1.0);
  }
`;

const FRAGMENT_CODE = `
  precision highp float;
  uniform sampler2D uDiffuse;
  
  varying vec2 vUv;
  
  float sourceOff(vec2 offset) {
    return texture2D(uDiffuse, vUv + offset).r;
  }
  
  float source() {
    return texture2D(uDiffuse, vUv).r;
  }
  
  void emit(float value) {
    gl_FragColor = vec4(value, 0.0, 0.0, 1.0);
  }
  
`;

export abstract class FilterPass {
  public static context: WebGLRenderingContext;

  private static readonly shaders: { [key: string]: Shader } = {};

  private static buffer: WebGLBuffer;

  private static indexBuffer: WebGLBuffer;

  private readonly shader: Shader;

  protected constructor(fragCode: string) {
    this.shader = FilterPass.createShader(fragCode);
  }

  protected abstract bind(GL: WebGLRenderingContext, uniforms: UniformList): void;

  public draw(source: WebGLTexture, target: WebGLFramebuffer, width: number, height: number) {
    this.shaderPass(this.shader, source, target, width, height);
  }

  protected shaderPass(
    shader: Shader,
    source: WebGLTexture,
    target: WebGLFramebuffer,
    width: number,
    height: number,
    bind?: (GL: WebGLRenderingContext, uniforms: UniformList) => void,
  ) {
    FilterPass.checkBuffers();
    const GL = FilterPass.context;
    const { buffer, indexBuffer } = FilterPass;

    GL.bindFramebuffer(GL.FRAMEBUFFER, target);
    GL.viewport(0, 0, width, height);
    GL.clearColor(1, 0, 0, 1);
    GL.clear(GL.COLOR_BUFFER_BIT);
    GL.useProgram(shader.program);
    GL.bindBuffer(GL.ARRAY_BUFFER, buffer);
    GL.enableVertexAttribArray(0);
    GL.vertexAttribPointer(0, 2, GL.FLOAT, false, 0, 0);
    GL.bindTexture(GL.TEXTURE_2D, source);
    GL.uniform1i(shader.uniforms.uDiffuse, 0);
    if (bind) {
      bind(GL, shader.uniforms);
    } else {
      this.bind(GL, shader.uniforms);
    }
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, indexBuffer);
    GL.drawElements(GL.TRIANGLES, 6, GL.UNSIGNED_BYTE, 0);
    GL.useProgram(null);
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);
    GL.activeTexture(GL.TEXTURE0);
  }

  protected static createShader(fragCode: string) {
    const hash = cyrb53(fragCode);
    if (!this.shaders[hash]) {
      const GL = this.context;

      const [vertex, fragment] = [VERTEX_CODE, FRAGMENT_CODE + fragCode].map((code, idx) => {
        const shader = GL.createShader(idx === 0 ? GL.VERTEX_SHADER : GL.FRAGMENT_SHADER)!;
        GL.shaderSource(shader, code);
        GL.compileShader(shader);
        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
          throw new Error(
            `[Shader] Unable to compile shader\n\n${code}\n\n${GL.getShaderInfoLog(shader)}`,
          );
        }

        return shader;
      });

      const program = GL.createProgram()!;
      GL.attachShader(program, vertex);
      GL.attachShader(program, fragment);
      GL.bindAttribLocation(program, 0, 'position');

      GL.linkProgram(program);
      if (!GL.getProgramParameter(program, GL.LINK_STATUS)) {
        throw new Error(`[Shader] Unable to link program\n\n${GL.getProgramInfoLog(program)}`);
      }

      const uniforms: UniformList = {};
      const uniformCount = GL.getProgramParameter(program, GL.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const info = GL.getActiveUniform(program, i);
        if (info) {
          uniforms[info.name] = GL.getUniformLocation(program, info.name)!;
        }
      }
      GL.useProgram(null);

      this.shaders[hash] = {
        uniforms,
        program,
      };
    }

    return this.shaders[hash];
  }

  private static checkBuffers() {
    const GL = this.context;
    if (!this.buffer) {
      this.buffer = GL.createBuffer()!;
      GL.bindBuffer(GL.ARRAY_BUFFER, this.buffer);
      GL.bufferData(GL.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), GL.STATIC_DRAW);
      GL.bindBuffer(GL.ARRAY_BUFFER, null);
    }
    if (!this.indexBuffer) {
      this.indexBuffer = GL.createBuffer()!;
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint8Array([0, 2, 1, 1, 2, 3]), GL.STATIC_DRAW);
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    }
  }

  /**
   * Создание фреймбуффера для прохода эффектов
   * @param width
   * @param height
   * @param data
   * @private
   */
  public static buildFramebuffer(width: number, height: number, data?: Uint8Array): FramebufferDef {
    const GL = this.context;

    // Создание текстуры-таргета
    const texture = GL.createTexture()!;
    GL.bindTexture(GL.TEXTURE_2D, texture);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    if (data) {
      // Если есть исходные данные - конвертим в RGBA и льем в текстуру
      const tempData = new Uint8Array(data.length * 4);
      for (let i = 0; i < data.length; i++) {
        const j = i * 4;
        tempData[j] = data[i];
        tempData[j + 1] = 0;
        tempData[j + 2] = 0;
        tempData[j + 3] = 255;
      }
      GL.texImage2D(
        GL.TEXTURE_2D,
        0,
        GL.RGBA,
        width,
        height,
        0,
        GL.RGBA,
        GL.UNSIGNED_BYTE,
        tempData,
      );
    } else {
      // Выделение места под текстуру
      GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, width, height, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
    }
    GL.bindTexture(GL.TEXTURE_2D, null);

    // Создание фреймбуффера и привязка текстуры
    const fbo = GL.createFramebuffer()!;
    GL.bindFramebuffer(GL.FRAMEBUFFER, fbo);
    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, texture, 0);
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);

    return {
      fbo,
      texture,
    };
  }
}
