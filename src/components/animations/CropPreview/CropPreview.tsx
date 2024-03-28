import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import css from './CropPreview.module.scss';
import { Animation, Animations } from '@/components/animations/Animation';

const CropPreview = () => {
  const [isActive, setIsActive] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const resize = () => {
    if (window.innerWidth < 800) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  window.addEventListener('resize', resize);
  useEffect(() => {
    resize();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className={clsx(css.block, isActive && css.active)} onClick={() => setIsActive(false)}>
      <div className={css.block__bg} />
      <div className={css.block__content}>
        {!isMobile ? (
          <div>
            <svg
              width="150"
              height="166"
              viewBox="0 0 150 166"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.762848 81.9913C0.308193 82.249 0.0014038 82.7373 0.0014038 83.2972C0.0014038 83.311 0.00159148 83.3248 0.00196442 83.3386C-0.0237863 83.9036 0.203629 84.4823 0.68421 84.8056L10.9474 91.7089C11.8596 92.3225 13 91.5555 13 90.3282V84.7972H26.5014C27.3298 84.7972 28.0014 84.1256 28.0014 83.2972C28.0014 82.4688 27.3298 81.7972 26.5014 81.7972H13V76.5215C13 75.2943 11.8596 74.5272 10.9474 75.1409L0.762848 81.9913Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M75.9336 0.762847C75.6759 0.308193 75.1876 0.00140346 74.6277 0.00140344C74.6138 0.00140343 74.6 0.00159111 74.5863 0.00196405C74.0213 -0.0237867 73.4426 0.203629 73.1193 0.68421L66.216 10.9474C65.6023 11.8596 66.3694 13 67.5966 13L73.1277 13L73.1277 26.5014C73.1277 27.3298 73.7993 28.0014 74.6277 28.0014C75.4561 28.0014 76.1277 27.3298 76.1277 26.5014L76.1277 13L81.4034 13C82.6306 13 83.3977 11.8596 82.784 10.9474L75.9336 0.762847Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M148.239 84.8584C148.693 84.6008 149 84.1125 149 83.5526C149 83.5387 149 83.5249 149 83.5112C149.025 82.9462 148.798 82.3675 148.317 82.0442L138.054 75.1408C137.142 74.5272 136.001 75.2943 136.001 76.5215L136.001 82.0526L122.5 82.0526C121.672 82.0526 121 82.7241 121 83.5526C121 84.381 121.672 85.0526 122.5 85.0526L136.001 85.0526L136.001 90.3282C136.001 91.5555 137.142 92.3225 138.054 91.7089L148.239 84.8584Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M73.0664 165.237C73.3241 165.692 73.8124 165.999 74.3723 165.999C74.3862 165.999 74.4 165.998 74.4137 165.998C74.9787 166.024 75.5574 165.796 75.8807 165.316L82.784 155.053C83.3977 154.14 82.6306 153 81.4034 153L75.8723 153L75.8723 139.499C75.8723 138.67 75.2007 137.999 74.3723 137.999C73.5439 137.999 72.8723 138.67 72.8723 139.499L72.8723 153L67.5966 153C66.3694 153 65.6023 154.14 66.216 155.053L73.0664 165.237Z"
                fill="white"
              />
              <rect x="42" y="38" width="65" height="90" rx="32.5" fill="white" />
              <rect
                x="67.5"
                y="50.9534"
                width="14"
                height="23"
                rx="7"
                fill="white"
                stroke="#333333"
                strokeWidth="2"
              />
              <path
                d="M42.7388 78.342C68.0086 83.3199 81.917 83.3251 106.262 78.342"
                stroke="#333333"
                strokeWidth="2"
              />
              <line
                x1="74.7612"
                y1="38"
                x2="74.7612"
                y2="51.4473"
                stroke="#333333"
                strokeWidth="2"
              />
              <line
                x1="74.7612"
                y1="73.8594"
                x2="74.7612"
                y2="82.0771"
                stroke="#333333"
                strokeWidth="2"
              />
              <rect
                x="43"
                y="39"
                width="63"
                height="88"
                rx="31.5"
                stroke="#333333"
                strokeWidth="2"
              />
              <path
                d="M44 77.8795C56.2455 81.3302 73.7611 81.3302 73.7611 81.3302V74.9197C69.6892 74.5468 66.5 71.1225 66.5 66.9534V57.9534C66.5 53.7842 69.6892 50.3599 73.7612 49.987L73.7612 40.0088C57.2578 40.4011 44 53.9023 44 70.5V77.8795Z"
                fill="#3BA1FF"
              />
            </svg>
            <svg
              width="145"
              height="166"
              viewBox="0 0 145 166"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="40" y="37.9256" width="65" height="90" rx="32.5" fill="white" />
              <rect
                x="65.5"
                y="50.879"
                width="14"
                height="23"
                rx="7"
                fill="#3BA1FF"
                stroke="#333333"
                strokeWidth="2"
              />
              <path
                d="M40.7388 78.2677C66.0086 83.2456 79.917 83.2507 104.262 78.2677"
                stroke="#333333"
                strokeWidth="2"
              />
              <line
                x1="72.5"
                y1="37.9256"
                x2="72.5"
                y2="51.3729"
                stroke="#333333"
                strokeWidth="2"
              />
              <line
                x1="72.5"
                y1="74.1588"
                x2="72.5"
                y2="82.3765"
                stroke="#333333"
                strokeWidth="2"
              />
              <rect
                x="41"
                y="38.9256"
                width="63"
                height="88"
                rx="31.5"
                stroke="#333333"
                strokeWidth="2"
              />
              <line
                x1="63.5"
                y1="17.4256"
                x2="81.5"
                y2="17.4256"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="72.5"
                y1="8.42561"
                x2="72.5"
                y2="26.4256"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="63.5"
                y1="143.426"
                x2="81.5"
                y2="143.426"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ) : (
          <div className={css.block__content_mobile}>
            <Animation type={Animations.drag} />
            <Animation type={Animations.pinch} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPreview;
