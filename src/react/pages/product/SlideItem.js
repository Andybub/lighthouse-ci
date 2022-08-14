import { useCallback, memo, useState } from 'react';
import PropTypes from 'prop-types';
import './SlideItem.scss';
import { addCart } from '@/service/CartAPI';

const SlideItem = ({ product, hoverDisabled, atcModalEnabled, position }) => {
  const { id, variantId, personalized, title, price, regularPrice, imageUrl, imageUrl2, href } = product;

  const [loading, setLoading] = useState(false);

  const handleClickATC = useCallback(() => {
    if (personalized) return;
    setLoading(true);
    addCart([{ id: variantId, quantity: 1 }]).then(({ items }) => {
      if (!atcModalEnabled) {
        window.location.href = '/cart';
        return;
      }
      const { EventEmitter, POPUP_ADDED_CART } = window.TW.main;
      EventEmitter.emit(POPUP_ADDED_CART, items[0]);
      setLoading(false);
    });
  }, []);

  let gtmProduct = '';
  if (position === 'rv') {
    gtmProduct = 'gtm-rv-product';
  } else {
    gtmProduct = `gtm${atcModalEnabled ? '' : '-pop'}-cab-product`;
  }

  return (
    <div className={`slide-item${hoverDisabled ? ' hover-disabled' : ''}`} data-product-id={id}>
      <a className={`${gtmProduct} product-thumb`} data-product-id={id} href={href}>
        <img src={imageUrl ?? imageUrl2} alt={title} />
        <div className="cta-btn">
          <button
            type="button"
            data-with-epi="true"
            className={`btn-add-to-wishlist swym-button swym-add-to-wishlist-view-product product_${id} btn-expandable rounded-circle mb-3`}
            data-swaction="addToWishlist"
            data-product-id={id}
            data-variant-id={variantId}
            data-product-url={`https://www.efavormart.com${href}`}
            aria-label="Add to Wishlist"
          >
            <i className="icomoon-wishlist" />
            <span className="text-nowrap text-capitalize text-white">Wish List</span>
          </button>
        </div>
      </a>
      {!!variantId && !personalized && (
        <div className={`product-action${loading ? ' is-loading' : ''}`}>
          <button
            type="button"
            className={`gtm${atcModalEnabled ? '' : '-pop'}-cab-atc btn-add-to-cart${loading ? ' is-loading' : ''}`}
            onClick={handleClickATC}
            data-product-id={id}
            disabled={loading}
          >
            <i className="fkt-cart-plus fkt-lg" /> Add To Cart
          </button>
        </div>
      )}
      {!!variantId && personalized && (
        <div className="product-action">
          <a className="btn-add-to-cart" href={href}>
            Customize
          </a>
        </div>
      )}
      <div className="product-info">
        <a className={`${gtmProduct} product-title`} data-product-id={id} href={href}>
          {title}
        </a>
        <div className="product-price">
          <span className="price">{price}</span>
          <span className="regular-price">{regularPrice}</span>
        </div>
      </div>
    </div>
  );
};

SlideItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    regularPrice: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    variantId: PropTypes.number,
    imageUrl2: PropTypes.string,
    personalized: PropTypes.bool,
  }).isRequired,
  hoverDisabled: PropTypes.bool,
  atcModalEnabled: PropTypes.bool,
  position: PropTypes.string,
};

SlideItem.defaultProps = {
  hoverDisabled: false,
  atcModalEnabled: false,
  position: '',
};

export default memo(SlideItem);
