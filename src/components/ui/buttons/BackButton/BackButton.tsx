import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import css from './BackButton.module.scss';
import { AppRoute } from '@/app-routes';
import { Icon } from '@/components/icons/Icon.tsx';

interface BackButtonProps {
  className?: string;
  children: ReactNode;
  path: AppRoute;
}

export const BackButton = ({ className, children, path }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <a className={clsx(css.link, className)} onClick={() => navigate(path)}>
      <Icon className={css.icon} id="arrow-left" />
      {children}
    </a>
  );
};
