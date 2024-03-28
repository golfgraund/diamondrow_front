import css from './Preloader.module.scss';
import { Header } from '@/components/header/Header';

const Preloader = () => (
  <div className={css.preload}>
    <Header />
    <div className={css.loader}>
      <svg
        width="66"
        height="66"
        viewBox="0 0 66 66"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="18" height="18" rx="4" fill="#787878" />
        <rect y="24" width="18" height="18" rx="4" fill="#787878" />
        <rect y="48" width="18" height="18" rx="4" fill="#787878" />
        <rect x="24" width="18" height="18" rx="4" fill="#787878" />
        <rect x="24" y="24" width="18" height="18" rx="4" fill="#787878" />
        <rect x="24" y="48" width="18" height="18" rx="4" fill="#787878" />
        <rect x="48" width="18" height="18" rx="4" fill="#787878" />
        <rect x="48" y="24" width="18" height="18" rx="4" fill="#787878" />
        <rect x="48" y="48" width="18" height="18" rx="4" fill="#787878" />
      </svg>
      <p>Создаём мозаику</p>
    </div>
  </div>
);

export default Preloader;
