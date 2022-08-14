import { useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import './TheSwiper.scss';
import SlideItem from '@/react/pages/product/SlideItem';
import { requestIdleCallback } from '@/utils/Polyfills';

const TheSwiper = ({ products, rootId, position }) => {
  const refSwiper = useRef();
  const refDOM = useRef();

  const initSwiper = useCallback(() => {
    const { Swiper } = window;
    refSwiper.current = new Swiper(refDOM.current, {
      spaceBetween: 10,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      slidesPerGroupAuto: true,
      watchSlidesProgress: true,
      loop: false,
      autoplay: false,
      preloadImages: false,
      freeMode: {
        enabled: true,
        sticky: true,
      },
      lazy: {
        enabled: true,
        checkInView: true,
        loadOnTransitionStart: true,
      },
      navigation: {
        prevEl: '.swiper-prev',
        nextEl: '.swiper-next',
        disabledClass: 'is-disabled',
      },
    });
  }, []);

  useEffect(() => {
    initSwiper();
    requestIdleCallback(() => {
      const domRoot = document.getElementById(rootId);
      domRoot.classList.remove('app-placeholder');

      window.SwymCallbacks = window.SwymCallbacks || [];
      window.SwymCallbacks.push(() => {
        // eslint-disable-next-line no-underscore-dangle
        window._swat.initializeActionButtons('.products-grid');
      });
    });
    return () => {
      refSwiper.current?.destroy();
    };
  }, []);

  return (
    <div className="the-swiper">
      <div className="swiper-container" ref={refDOM}>
        <div className="swiper-wrapper">
          {products.map((product) => (
            <div className="swiper-slide" key={product.id}>
              <SlideItem product={product} position={position} atcModalEnabled />
            </div>
          ))}
        </div>
        <button type="button" className={`swiper-prev${position === 'cab' ? ' gtm-cab-scroll' : ''}`}>
          <span className="icomoon-arrow-4" />
        </button>
        <button type="button" className={`swiper-next${position === 'cab' ? ' gtm-cab-scroll' : ''}`}>
          <span className="icomoon-arrow-4" />
        </button>
      </div>
    </div>
  );
};

TheSwiper.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      regularPrice: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      variantId: PropTypes.number,
      imageUrl2: PropTypes.string,
      personalized: PropTypes.bool,
    }),
  ).isRequired,
  rootId: PropTypes.string.isRequired,
  position: PropTypes.string,
};

TheSwiper.defaultProps = {
  position: '',
}

export default TheSwiper;
