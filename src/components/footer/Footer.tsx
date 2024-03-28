import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';
import css from './Footer.module.scss';
import { AppRoute } from '@/app-routes';
import logo from '@/assets/images/logo@2x.png';

interface FooterProps {
  className?: string;
}

export const Footer = ({ className }: FooterProps) => (
  <footer className={clsx(css.footer, className)}>
    <div className={clsx(css.footer__wrapper, 'wrapper')}>
      <NavLink to={AppRoute.Main}>
        <img className={css.logo} src={logo} width={100} height={60} alt="logo" />
      </NavLink>
    </div>
  </footer>
);
