import { useRef, useCallback, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import './RootSwiper.scss';
import { useModalContext } from '@/react/contexts/STLModal';

const RootSwiper = ({ looks }) => {
  const refSwiper = useRef();
  const refDOM = useRef();

  const { popupLook, setPopupLook } = useModalContext();

  const handleLookClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const { id } = e.target.dataset;
      if (!id || popupLook) return;
      setPopupLook(+id);
    },
    [popupLook, setPopupLook],
  );

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
    return () => {
      refSwiper.current?.destroy();
    };
  }, []);

  return (
    <div className="shop-the-look-swiper">
      <div className="swiper-container" ref={refDOM}>
        <div className="swiper-wrapper" onClick={handleLookClick}>
          {looks.map(({ id, title, image_url: imageUrl, default_tag: defaultTag }) => (
            <a
              className="swiper-slide gtm-click-stl"
              key={id}
              data-id={id}
              data-look-id={id}
              href={`https://www.efavormart.com/pages/shop-the-looks?look=${id}`}
            >
              <img className="swiper-image" src={imageUrl} alt={title} />
              <span className="swiper-label">
                <span className="icomoon icomoon-on-sale" />
                {defaultTag}
              </span>
            </a>
          ))}
        </div>
        <button type="button" className="swiper-prev">
          <span className="icomoon-arrow-4" />
        </button>
        <button type="button" className="swiper-next">
          <span className="icomoon-arrow-4" />
        </button>
      </div>
    </div>
  );
};

RootSwiper.propTypes = {
  looks: PropTypes.array.isRequired,
};

export default memo(RootSwiper);
