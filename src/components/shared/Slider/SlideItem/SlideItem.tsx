import { clsx } from 'clsx';
import css from './SlideItem.module.scss';

interface SlideItemProps {
  img?: string;
  index: number;
  onClick: () => void;
  active: boolean;
}

export const SlideItem = ({ img, index, active, onClick }: SlideItemProps) => (
  <button
    className={clsx(css.slide, img && css.slideImage, active && css.active)}
    type="button"
    onClick={onClick}
  >
    {img ? <img src={img} alt="" /> : <span>{index + 1}</span>}
  </button>
);
