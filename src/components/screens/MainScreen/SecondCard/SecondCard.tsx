import { clsx } from 'clsx';
import css from './SecondCard.module.scss';
import { AppRoute } from '@/app-routes';
import secondImageDesktop from '@/assets/images/main/second-desktop.png';
import secondImageDesktop2x from '@/assets/images/main/second-desktop@2x.png';
import secondImageTablet from '@/assets/images/main/second-tablet.png';
import secondImageTablet2x from '@/assets/images/main/second-tablet@2x.png';
import { PrimaryButton } from '@/components/ui/buttons/PrimaryButton/PrimaryButton.tsx';

interface SecondCardProps {
  className?: string;
}

export const SecondCard = ({ className }: SecondCardProps) => (
  <div className={clsx(className, css.section)}>
    <div className={css.wrapper}>
      <div className={css.content}>
        <h2 className={css.title}>Как будет выглядеть мозаика?</h2>
        <p className={css.text}>
          Перед покупкой набора загрузите фото и&nbsp;посмотрите, как будет выглядеть ваша мозаика.
        </p>
        <PrimaryButton className={css.button} text="Посмотреть" navLink={AppRoute.StepColorSize} />
      </div>
      <div className={css.picture}>
        <picture>
          <source
            media="(min-width: 1025px)"
            srcSet={`${secondImageDesktop} 1x, ${secondImageDesktop2x} 2x`}
          />
          <img
            src={secondImageTablet}
            srcSet={secondImageTablet2x}
            alt="Chris standing up holding his daughter Elva"
          />
        </picture>
      </div>
    </div>
  </div>
);
