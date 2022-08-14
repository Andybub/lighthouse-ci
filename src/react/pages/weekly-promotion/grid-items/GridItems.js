// import './GridItems.scss';
import { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getBadge } from '@/utils/DiscountBadge';
// import GridItem from './GridItem';
import GridItem from '@/react/pages/collection/grid-items/GridItem';

// TODO layout Figma
// TODO Back in stock

const GridItems = (props) => {
  // console.log('GridItems');
  const { realPayload, windowWidth, mobileMode, relatedPayload, gridType } = props;
  const [products, setProducts] = useState([]);
  const [discountBadge, setDiscountBadge] = useState(null);
  const [swymWishlistReady, setSwymWishlistReady] = useState(false);

  useEffect(() => {
    if (mobileMode && relatedPayload) {
      setProducts(relatedPayload);
    } else if (realPayload) {
      setProducts(realPayload);
    }
  }, [mobileMode, realPayload, relatedPayload]);

  const refSwiper = useRef();
  const refDOM = useRef();

  const initSwiper = useCallback(() => {
    const { Swiper } = window;

    const swiperOptions = {
      slidesPerView: 4,
      spaceBetween: 20,
      loop: gridType === 'grid_collection',
      watchOverflow: gridType === 'grid_products',
      resizeObserver: true,
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
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next',
      },
      breakpoints: {
        320: {
          slidesPerView: 2,
        },
        576: {
          slidesPerView: 3,
        },
        992: {
          slidesPerView: 4,
        },
      },
    }

    refSwiper.current = new Swiper(refDOM.current, swiperOptions);

    setTimeout(() => {
      refDOM.current.swiper.update();
    }, 0);
  }, []);

  useEffect(() => {
    setDiscountBadge(getBadge());
    // SWYM Wishlist
    window.SwymCallbacks = window.SwymCallbacks || [];
    window.SwymCallbacks.push((swat) => {
      // console.log('SWYM ready!');
      setSwymWishlistReady(true);
      window._swat.initializeActionButtons('.products-grid');
    });
  }, []);

  // useEffect(() => {
  //   console.log('discountBadge', discountBadge);
  // }, [discountBadge]);

  // useEffect(() => {
  //   // console.log('products or swymWishlistReady change!');
  //   if (swymWishlistReady && realPayload.length > 0) {
  //     if (swymWishlistReady && window._swat && window._swat.initializeActionButtons) {
  //       window._swat.initializeActionButtons('.products-grid');
  //     }
  //   }
  // }, [realPayload, swymWishlistReady]);

  useEffect(() => {
    if (products && products.length > 0) {
      initSwiper();
    }
    return () => {
      refSwiper.current?.destroy();
    };
  }, [products]);

  return (
    <div className="collection-products" data-section-id="collection-template">
      {products.length > 0 && (
        <div className="swiper swiper-container w-100" ref={refDOM}>
          <div className="swiper-wrapper products-grid p-style-01">
            {products.map((product, index) => {
              return (
                <GridItem
                  key={product.id}
                  index={index}
                  product={product}
                  windowWidth={windowWidth}
                  discountBadge={discountBadge}
                  mobileMode={mobileMode}
                  liClass="swiper-slide"
                />
              );
            })}
          </div>
          <div className="swiper-buttons position-absolute">
            <div className="content-buttons position-relative">
              <div className="swiper-button-prev"><i className="icomoon-arrow-4" /></div>
              <div className="swiper-button-next"><i className="icomoon-arrow-4" /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

GridItems.propTypes = {
  realPayload: PropTypes.array.isRequired,
  windowWidth: PropTypes.number.isRequired,
  mobileMode: PropTypes.bool.isRequired,
  relatedPayload: PropTypes.array,
};

GridItems.defaultProps = {
  relatedPayload: null,
};

export default GridItems;
