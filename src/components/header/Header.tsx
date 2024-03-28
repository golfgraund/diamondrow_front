import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import css from './Header.module.scss';
import { AppRoute } from '@/app-routes';
import logo from '@/assets/images/logo@2x.png';

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className={clsx(css.header, className)}>
      <a className={clsx(css.header__wrapper, 'wrapper')}>
        <button onClick={() => navigate(AppRoute.Main)}>
          <img className={css.logo} src={logo} width={100} height={60} alt="logo" />
        </button>
      </a>
    </header>
  );
};
