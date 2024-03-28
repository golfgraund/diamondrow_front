import { clsx } from 'clsx';
import css from './ParticlesVariants.module.scss';
import { COLORS_ICONS, COLORS_MAP } from '@/colors.ts';

// чб
const COLORS1 = [
  { symbol: 'A', color: COLORS_MAP.get('dmc-5200'), checkedIcon: COLORS_ICONS.get('dmc-5200') },
  { symbol: 'B', color: COLORS_MAP.get('dmc-762'), checkedIcon: COLORS_ICONS.get('dmc-762') },
  { symbol: 'C', color: COLORS_MAP.get('dmc-168'), checkedIcon: COLORS_ICONS.get('dmc-168') },
  { symbol: 'D', color: COLORS_MAP.get('dmc-317'), checkedIcon: COLORS_ICONS.get('dmc-317') },
  { symbol: 'E', color: COLORS_MAP.get('dmc-3799'), checkedIcon: COLORS_ICONS.get('dmc-3799') },
  { symbol: 'F', color: COLORS_MAP.get('dmc-310'), checkedIcon: COLORS_ICONS.get('dmc-310') },
];

interface ParticlesVariantsProps {
  className?: string;
}

export const ParticlesVariants = ({ className }: ParticlesVariantsProps) => (
  <div className={clsx(css.particles, className)}>
    <div className={css.particles__wrapper}>
      <div className={css.particles__colors}>
        {COLORS1.map((color) => (
          <button
            key={`${color.symbol + color.color}`}
            className={css.colorPicker}
            type="button"
            style={{ backgroundColor: `${color.color}` }}
          >
            <span className={css.default}>{color.symbol}</span>
            <img className={css.checked} src={color.checkedIcon} />
          </button>
        ))}
      </div>
    </div>
  </div>
);
