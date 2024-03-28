import { clsx } from 'clsx';
import css from './ThirdCard.module.scss';
import thirdImageDesktop from '@/assets/images/main/third-desktop.png';
import thirdImageDesktop2x from '@/assets/images/main/third-desktop@2x.png';
import thirdImageTablet from '@/assets/images/main/third-tablet.png';
import thirdImageTablet2x from '@/assets/images/main/third-tablet@2x.png';

interface ThirdCardProps {
  className?: string;
}

export const ThirdCard = ({ className }: ThirdCardProps) => (
  <div className={clsx(className, css.section)}>
    <div className={css.wrapper}>
      <div className={css.content}>
        <h2 className={css.title}>Где купить мозаику по фото?</h2>
        <p className={css.text}>
          Выберите размер и цвет мозаики и&nbsp;закажите набор удобным вам способом
        </p>
        <div className={css.buttons}>
          <h3 className={css.subtitle}>Маркетплейсы:</h3>
          <a
            href={import.meta.env.VITE_APP_WB}
            className={clsx(css.button, 'button button--secondary button--wb')}
          >
            <span className="text-m">Wildberries</span>
          </a>
          <a
            href={import.meta.env.VITE_APP_OZON}
            className={clsx(css.button, 'button button--secondary button--ozon')}
          >
            <span className="text-m">Ozon</span>
          </a>
        </div>
      </div>
      <div className={css.picture}>
        <picture>
          <source
            media="(min-width: 1025px)"
            srcSet={`${thirdImageDesktop} 1x, ${thirdImageDesktop2x} 2x`}
          />
          <img
            src={thirdImageTablet}
            srcSet={thirdImageTablet2x}
            alt="Chris standing up holding his daughter Elva"
          />
        </picture>
      </div>
    </div>
  </div>
);
