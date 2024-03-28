import { FilterPass } from '@/pixelation/filters/FilterPass.ts';

const CODE = `
  void main() {
    emit(source());
  }
`;

export class CopyPass extends FilterPass {
  public constructor() {
    super(CODE);
  }

  protected bind() {}
}
