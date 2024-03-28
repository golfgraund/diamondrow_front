import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import css from './MainCard.module.scss';
import { AppRoute } from '@/app-routes.ts';
import { MainCardCanvas } from '@/components/screens/MainScreen/MainCard/MainCardCanvas';
import { PrimaryButton } from '@/components/ui/buttons/PrimaryButton/PrimaryButton.tsx';

interface MainCardProps {
  className?: string;
}

export const MainCard = ({ className }: MainCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const scene = new MainCardCanvas(canvas);

      return () => {
        scene.dispose();
      };
    }
  }, []);

  return (
    <div className={clsx(css.block, className)}>
      <div className={css.hero}>
        <canvas ref={canvasRef} />
      </div>
      <div className={css.content}>
        <h1 className={css.title}>Набор&nbsp;для создания мозаики по&nbsp;фото</h1>
        <p className={css.text}>
          У вас уже есть набор? Введите код с упаковки и&nbsp;получите инструкцию, как сделать
          алмазную мозаику из вашей фотографии
        </p>
        <PrimaryButton
          navLink={AppRoute.StepCode}
          className={css.button}
          text="Получить инструкцию"
        />
      </div>
    </div>
  );
};
