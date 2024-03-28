import { useEffect } from 'react';
import { clsx } from 'clsx';
import css from './ScreenInstructions.module.scss';
import { AppRoute } from '@/app-routes';
import img1 from '@/assets/images/instruction/image1@2x.png';
import img2 from '@/assets/images/instruction/image2@2x.png';
import img3 from '@/assets/images/instruction/image3@2x.png';
import img4 from '@/assets/images/instruction/image4@2x.png';
import img5 from '@/assets/images/instruction/image5@2x.png';
import { Header } from '@/components/header/Header.tsx';
import { Icon } from '@/components/icons/Icon.tsx';
import { BackButton } from '@/components/ui/buttons/BackButton/BackButton.tsx';
import { PrimaryButton } from '@/components/ui/buttons/PrimaryButton/PrimaryButton.tsx';

export const ScreenInstructions = () => {
  const slug = localStorage.getItem('slug');

  useEffect(() => {
    window.scrollTo({ top: -999 });
  }, []);

  return (
    <section className={css.section}>
      <Header className={css.header} />
      <div className={clsx(css.wrapper, 'wrapper')}>
        <BackButton className={css.backButton} path={AppRoute.Constructor}>
          <span>Назад</span>
        </BackButton>
        <div className={css.content}>
          <div className={css.block}>
            <h2 className={css.title}>Как пользоваться инструкцией?</h2>
            <img className={css.image} src={img1} alt="" />
            <p className={clsx(css.text, 'text-m', 'fw-medium')}>
              В инструкции есть номера секторов, как на основе для мозаики. Их можно переключать,
              выбирая нужный.
            </p>
          </div>

          <div className={css.block}>
            <img className={css.image} src={img2} alt="" />
            <p className={clsx(css.text, 'text-m', 'fw-medium')}>
              Цифры показывают сколько страз одного цвета будут идти подряд в ряду.
            </p>
          </div>

          <div className={css.block}>
            <img className={css.image} src={img3} alt="" />
            <p className={clsx(css.text, 'text-m', 'fw-medium')}>
              Для удобства можно выбрать один или несколько цветов, они подсветятся на схеме. Если в
              ячейках указано “Х”, то заполнять их не требуется.
            </p>
          </div>

          <div className={css.block}>
            <img className={css.image} src={img4} alt="" />
            <p className={clsx(css.text, 'text-m', 'fw-medium')}>
              Можно отмечать уже выложенные стразы, нажимая на них.
            </p>
          </div>

          <div className={css.block}>
            <img className={css.image} src={img5} alt="" />
            <p className={clsx(css.text, 'text-m', 'fw-medium')}>
              Чтобы убрать отметку, снова нажмите на нужную стразу или на кнопку под схемой.
            </p>
          </div>

          <div className={clsx(css.block, css.blockProgress)}>
            <Icon className={css.icon} id="save" />
            <p className={clsx(css.text, 'text-m', 'fw-bold')}>
              Ваш прогресс сохранится, если вы закроете инструкцию.
            </p>
          </div>

          <PrimaryButton navLink={`/constructor/${slug}`} text="Начать сборку" />
        </div>
      </div>
    </section>
  );
};
