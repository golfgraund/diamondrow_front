import { clsx } from 'clsx';
import css from './MainScreen.module.scss';
import { Header } from '@/components/header/Header.tsx';
import { MainCard } from '@/components/screens/MainScreen/MainCard/MainCard';
import { SecondCard } from '@/components/screens/MainScreen/SecondCard/SecondCard.tsx';
import { ThirdCard } from '@/components/screens/MainScreen/ThirdCard/ThirdCard.tsx';

export const MainScreen = () => (
  <section className={clsx(css.section)}>
    <Header />
    <div className={clsx(css.wrapper, 'wrapper wrapper--main')}>
      <MainCard className={css.mainBlock} />
      <SecondCard className={css.secondBlock} />
      <ThirdCard className={css.thirdBlock} />
    </div>
  </section>
);
