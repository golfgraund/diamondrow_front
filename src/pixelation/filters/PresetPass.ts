import { BrightnessContrastPass } from '@/pixelation/filters/BrightnessContrastPass.ts';
import { ColorFilter, ColorSet } from '@/pixelation/PixelationTypes.ts';

export class PresetPass extends BrightnessContrastPass {
  public constructor(colorSet: ColorSet, preset: ColorFilter) {
    let factor = 0;
    switch (preset) {
      case ColorFilter.Lighter:
        factor = 1;
        break;
      case ColorFilter.Lightest:
        factor = 2;
        break;
      case ColorFilter.Darker:
        factor = -1;
        break;
      case ColorFilter.Darkest:
        factor = -2;
        break;
    }

    let brightness = 0;
    let contrast = 1;
    switch (colorSet) {
      case ColorSet.BlackAndWhite:
        brightness = 0.19 + factor * 0.05;
        contrast = 0.6 + Math.max(factor * 0.07, 0);
        break;
      case ColorSet.Sepia:
        brightness = 0.22 + factor * 0.05;
        contrast = 0.75 + Math.max(factor * 0.15, 0);
        break;
      case ColorSet.PopArt:
        brightness = 0.2 + factor * 0.07;
        contrast = 0.7 + Math.max(factor * 0.1, 0);
        break;
    }

    super(brightness, contrast);
  }
}
