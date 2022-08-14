import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import GridProductItem from '@/react/ui/stl/GridProductItem';
import { useModalContext } from '@/react/contexts/STLModal';
import { getVariant } from '@/react/utils/stl';
import { addToCart, getCart } from '@/react/api/stl';

const GridProductContainer = ({ lookData }) => {
  const swiperRef = useRef();
  const listRef = useRef();

  const { hoveredProductId, setHoveredProductId, respondMobile, swiperIndex, setSwiperIndex } = useModalContext();

  const [swiper, setSwiper] = useState(null);
  const [allowPrev, setAllowPrev] = useState(false);
  const [allowNext, setAllowNext] = useState(false);
  const [loading, setLoading] = useState(false);

  const numAddableItems = useMemo(() => {
    if (!lookData || !lookData.products) return 0;
    return lookData.products.reduce((num, product) => {
      if (product.customize || !product.available) return num;
      return num + 1;
    }, 0);
  }, [lookData]);

  const handleAddAllToCart = useCallback(async () => {
    if (!lookData || !lookData.products) return;
    setLoading(true);

    const addableItems = lookData.products
      .filter(({ customize, available }) => !customize && available)
      .map(({ preorder, preorderMsg, data }) => {
        const { id } = getVariant(data);
        return {
          id,
          quantity: 1,
          properties: !preorder
            ? ''
            : {
                'In Stock': preorderMsg,
                date_diff: preorderMsg.replace('Preorder: ', '').replace('Available on  ', ''),
              },
        };
      });

    await addToCart(addableItems);

    const { items: cartItems } = await getCart();

    setLoading(false);

    const cartCounts = cartItems.reduce((num, item) => {
      // Personalized Rush Production Time ==> not include in cart counts
      if (String(item.id) === '39308598083630') return num;
      return num + item.quantity;
    }, 0);

    $('.cart-count').text(cartCounts);
  }, [lookData]);

  useEffect(() => {
    if (swiper) {
      // console.log("useEffect swiperIndex", swiperIndex, "realIndex", swiper.realIndex);
      // swiper.autoplay.stop();
      swiper.slideToLoop(swiperIndex, 300, false);
    }
  }, [swiper, swiperIndex]);

  // NOTE: Causing sliding-bug while sliding to the first or last after clicking ImageDots
  // useEffect(() => {
  //   if (!lookData || !swiper) return;
  //   const items = listRef.current.querySelectorAll('.product-box');
  //   for (let i = 0; i < items.length; i++) {
  //     const item = items[i];
  //     const { productId } = item.dataset;
  //     if (+productId === hoveredProductId) item.classList.add('mouse-enter');
  //     else item.classList.remove('mouse-enter');
  //   }
  //   const index = lookData.products.findIndex(({ product_id: id }) => id === hoveredProductId);
  //   const delta = Math.abs(index - swiper.realIndex);
  //   if (index > -1 && delta > 0) swiper.slideTo(index, 300 * delta);
  // }, [lookData, swiper, hoveredProductId]);

  const handleSwiperInit = useCallback(
    (s) => {
      setSwiper(s);
      s.update();
      if (!lookData) return;
      const { product_id: id } = lookData.products[s.realIndex];
      setHoveredProductId(id);
      setAllowPrev(!s.isBeginning);
      setAllowNext(!s.isEnd);
    },
    [lookData, setHoveredProductId],
  );

  const handleSwiperSlide = useCallback(
    (s) => {
      if (!lookData) return;
      const { product_id: id } = lookData.products[s.realIndex];
      console.log(s.realIndex, id);
      setHoveredProductId(id);
      setSwiperIndex(s.realIndex);
      setAllowPrev(!s.isBeginning);
      setAllowNext(!s.isEnd);
    },
    [lookData, setHoveredProductId, setSwiperIndex],
  );

  const initSwiper = useCallback(() => {
    if (swiper) return;
    const { Swiper } = window;
    setSwiper(
      new Swiper(swiperRef.current, {
        slidesPerView: 1,
        slidesPerGroup: 1,
        speed: 300,
        loop: false,
        on: {
          init: handleSwiperInit,
          slideChange: handleSwiperSlide,
        },
      }),
    );
  }, [swiper, handleSwiperInit, handleSwiperSlide]);

  const destroySwiper = useCallback(() => {
    if (!swiper) return;
    swiper.destroy(true, true);
    setSwiper(null);
  }, [swiper]);

  useEffect(() => {
    if (!respondMobile) destroySwiper();
    else if (!swiper) setTimeout(initSwiper, 50);
    return destroySwiper;
  }, [respondMobile, swiper, initSwiper, destroySwiper]);

  return (
    <div className={`stl-product-container${respondMobile ? ' swiper' : ''}`} ref={swiperRef}>
      <ul className={`stl-product-list-container${respondMobile ? ' swiper-wrapper' : ''}`} ref={listRef}>
        {lookData.products.map((product) => (
          <GridProductItem key={product.id} product={product} />
        ))}
        <li className="stl-add-all-to-cart">
          {loading && <span className="swiper-lazy-preloader" />}
          {!loading && (
            <span className="text-link gtm-stl-aatc" onClick={handleAddAllToCart}>
              Add {numAddableItems} Items To Cart
            </span>
          )}
        </li>
      </ul>
      <button
        type="button"
        className={`stl-swiper-button-prev${!allowPrev ? ' is-disabled' : ''}`}
        onClick={() => swiper?.slidePrev()}
      >
        <i className="icomoon-arrow-4" />
      </button>
      <button
        type="button"
        className={`stl-swiper-button-next${!allowNext ? ' is-disabled' : ''}`}
        onClick={() => swiper?.slideNext()}
      >
        <i className="icomoon-arrow-4" />
      </button>
    </div>
  );
};

GridProductContainer.propTypes = {
  lookData: PropTypes.object.isRequired,
};

export default GridProductContainer;
