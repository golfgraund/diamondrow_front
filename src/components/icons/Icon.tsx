export type IconId =
  | 'popup-telegram'
  | 'popup-viber'
  | 'popup-whatsapp'
  | 'popup-button'
  | 'save'
  | 'arrow-right'
  | 'arrow-left'
  | 'horizontal-orientation'
  | 'vertical-orienation'
  | 'tap'
  | 'pdf'
  | 'plus'
  | 'minus'
  | 'rotate'
  | 'sun'
  | 'social-youtube'
  | 'social-instagram'
  | 'social-facebook'
  | 'social-linkedin'
  | 'social-twitter'
  | 'social-telegram';

interface Props {
  className?: string;
  id: IconId;
}

export const Icon = ({ className, id }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
    className={className}
  >
    <use xlinkHref={`#${id}`} />
  </svg>
);
