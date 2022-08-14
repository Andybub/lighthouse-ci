import './BestSellers.scss';
import { useRef, useCallback, useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const ProductItem = (props) => {
  const { data } = props;
  const url = new URL(data.url, 'https://www.efavormart.com');
  const dataView = url.pathname;

  return (
    <div className="swiper-slide smallCard border p-0" key={data.id} title={data.title} data-product-id={data.id}>
      <div className="row m-0">
        <div className="product-thumb col-6 p-0">
          <a
            className="d-inline-block position-relative w-100 gtm-bs-product"
            data-product-id={data.id}
            href={data.url}
          >
            <span className="sizing text-white position-absolute py-1 px-3" data-active={!!data.metaTag}>
              {data.metaTag}
            </span>
            <img className="lazyload img-fluid w-100" data-src={data.image} alt={data.title} />
          </a>
        </div>
        <div className="product-body col-6 bg-white">
          <div className="product-name mb-2">
            <a
              className="m-0 font-weight-bold text-capitalize gtm-bs-product"
              data-product-id={data.id}
              href={data.url}
            >
              {data.title}
            </a>
          </div>
          <div className="product-price justify-content-start mb-2">
            <ins className="text-decoration-none">${(data.price_min * 0.01).toFixed(2)}</ins>
            <del className="">${(data.compare_at_price_min * 0.01).toFixed(2)}</del>
          </div>
          <button
            type="button"
            className="btn-quick-view quick-view rounded-pill text-uppercase text-center text-white border-0"
            data-view={dataView}
            data-target="#md_qvModal"
            data-product-id={data.id}
          >
            Select Options
          </button>
        </div>
      </div>
    </div>
  );
};

ProductItem.propTypes = {
  data: PropTypes.object.isRequired,
};

const BestSellers = (props) => {
  const { title, slides } = props;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Update the document title using the browser API
    // document.title = `You clicked ${count} times`;
    const skus = slides.reduce((previousValue, currentSlide, index) => {
      return `${previousValue}${index > 0 ? ' OR ' : ''}variants.sku:${currentSlide.split(',')[0]}`;
    }, '');

    axios.get(`/search?q=${skus}&view=best-sellers&type=product`).then((response) => {
      setProducts(response.data.products);
    });
  }, []);

  const refSwiper = useRef();
  const refDOM = useRef();

  const initSwiper = useCallback(() => {
    const { Swiper } = window;
    refSwiper.current = new Swiper(refDOM.current, {
      spaceBetween: 40,
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      slidesPerGroupAuto: true,
      watchSlidesProgress: true,
      loop: true,
      autoplay: {
        delay: 7000,
      },
      preloadImages: false,
      centeredSlides: true,
      freeMode: {
        enabled: true,
        sticky: true,
      },
      lazy: {
        enabled: true,
        checkInView: true,
        loadOnTransitionStart: true,
      },
      pagination: {
        el: '.swiper-pagination',
      },
      navigation: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next',
        disabledClass: 'is-disabled',
      },
    });
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      initSwiper();
    }
    return () => {
      refSwiper.current?.destroy();
    };
  }, [products]);

  return (
    <div className="best-sellers-container w-100 my-2 pl-4 pr-4 pt-0 pb-5 rounded-lg">
      <h2 className="best-sellers-title mb-0 py-2 font-weight-bold text-center">{`Popular Picks in ${title}`}</h2>
      {products.length > 0 && (
        <div className="position-relative">
          <div className="swiper swiper-container" ref={refDOM}>
            <div className="swiper-wrapper">
              {products.map((product) => {
                return <ProductItem key={product.id} data={product} />;
              })}
            </div>
            <div className="swiper-buttons position-absolute">
              <div className="content-buttons position-relative">
                <div className="swiper-button-prev fkt-2x rounded-circle" />
                <div className="swiper-button-next fkt-2x rounded-circle" />
              </div>
            </div>
          </div>
          <div className="swiper-pagination w-100" />
        </div>
      )}
    </div>
  );
};

BestSellers.propTypes = {
  title: PropTypes.string.isRequired,
  slides: PropTypes.array.isRequired,
};

export default memo(BestSellers);
