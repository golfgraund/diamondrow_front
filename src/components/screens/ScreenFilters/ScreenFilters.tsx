import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { StepTitle } from '@/components/shared/StepTitle/StepTitle.tsx';
import css from './ScreenFilters.module.scss';
import { AppRoute } from '@/app-routes.ts';
import { Header } from '@/components/header/Header.tsx';
import { FilterOptions } from '@/components/screens/ScreenFilters/FilterOptions/FilterOptions.tsx';
import { BackButton } from '@/components/ui/buttons/BackButton/BackButton.tsx';
import { PrimaryButton } from '@/components/ui/buttons/PrimaryButton/PrimaryButton.tsx';
import { FilterManager } from '@/mosaic/FilterManager';

const SHOW_HINT = false;

export const ScreenFilters = () => {
  const [isHint, setIsHint] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const img = FilterManager.getImage();
    window.scrollTo({ top: -999 });

    if (!img) {
      navigate(AppRoute.StepUploadPhoto);
    }
  }, [navigate]);

  return (
    <section className={css.section}>
      <Header className={css.header} />
      <div className={clsx(css.wrapper, 'wrapper wrapper--slider')}>
        <BackButton className={css.backButton} path={AppRoute.StepUploadPhoto}>
          <span>Назад</span>
        </BackButton>
        <div className={css.content}>
          <StepTitle className={css.step} step={3} text="Выберите вариант мозаики" />
          {SHOW_HINT && (
            <div className={css.hint}>
              <span onMouseEnter={() => setIsHint(true)} onMouseLeave={() => setIsHint(false)}>
                <svg
                  width="16"
                  height="25"
                  viewBox="0 0 16 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.63315 17.0711V16.853C5.64905 15.4294 5.79613 14.2967 6.07438 13.4548C6.36059 12.6129 6.76604 11.9318 7.29075 11.4114C7.81546 10.8909 8.44749 10.4164 9.18685 9.9878C9.66385 9.69697 10.0932 9.3717 10.4748 9.01198C10.8564 8.65227 11.1585 8.23898 11.3811 7.77212C11.6037 7.30525 11.715 6.78864 11.715 6.22229C11.715 5.54113 11.548 4.95181 11.2141 4.45433C10.8802 3.95685 10.435 3.57418 9.87851 3.30631C9.32995 3.03078 8.71779 2.89302 8.04203 2.89302C7.42988 2.89302 6.84554 3.01548 6.28904 3.26039C5.73253 3.5053 5.27142 3.88797 4.90572 4.40841C4.54001 4.92119 4.32933 5.58322 4.27368 6.39449H0.648438C0.704088 5.01686 1.06582 3.85353 1.73363 2.9045C2.40144 1.94781 3.2839 1.22456 4.38101 0.734734C5.48608 0.244911 6.70642 0 8.04203 0C9.50485 0 10.7848 0.264046 11.8819 0.792138C12.979 1.31257 13.8297 2.04348 14.4339 2.98486C15.0461 3.91859 15.3522 5.00921 15.3522 6.25673C15.3522 7.11392 15.213 7.88692 14.9348 8.57573C14.6565 9.25689 14.259 9.86535 13.7423 10.4011C13.2335 10.9368 12.6213 11.4114 11.9058 11.8246C11.23 12.2303 10.6815 12.6512 10.2601 13.0875C9.84671 13.5237 9.5446 14.0403 9.3538 14.6373C9.163 15.2343 9.05965 15.9728 9.04375 16.853V17.0711H5.63315Z"
                    fill="black"
                  />
                  <ellipse cx="7.47841" cy="22.7176" rx="2.36904" ry="2.2718" fill="black" />
                </svg>
                Сливается фото?
              </span>
              <p className={clsx(css.hint__content, isHint && css.active)}>
                Если мозаика сливается в один цвет, то это означает, что на фото слишком много
                похожих оттенков. Попробуйте загрузить другое изображение
              </p>
            </div>
          )}
          <FilterOptions />
          <PrimaryButton
            className={css.button}
            navLink={AppRoute.StepEmail}
            text="Далее"
            handler={() => FilterManager.generatePdfImages()}
          />
        </div>
      </div>
    </section>
  );
};
