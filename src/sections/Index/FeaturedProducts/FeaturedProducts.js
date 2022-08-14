import '@/react/pages/collection/grid-items/GridItems.scss';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getBadge } from '@/utils/DiscountBadge';
import GridItem from '@/react/pages/collection/grid-items/GridItem';

const FeaturedProducts = (props) => {
  const { title, url, products } = props;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mobileMode, setMobileMode] = useState(window.innerWidth < 992);
  const [discountBadge, setDiscountBadge] = useState(null);
  const [swymWishlistReady, setSwymWishlistReady] = useState(false);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
    setDiscountBadge(getBadge());
    // SWYM Wishlist
    window.SwymCallbacks = window.SwymCallbacks || [];
    window.SwymCallbacks.push((swat) => {
      // console.log('SWYM ready!');
      setSwymWishlistReady(true);
      window._swat.initializeActionButtons('.products-grid');
    });
    // cart
    const { EventEmitter, CART_LOADED, CART_UPDATED } = window.TW.main;
    EventEmitter.on(CART_LOADED, (cartData) => {
      setCart(cartData);
    });
    EventEmitter.on(CART_UPDATED, (cartData) => {
      setCart(cartData);
    });
    window.Shopify.KT_getCart();
  }, []);

  useEffect(() => {
    setMobileMode(windowWidth < 992);
  }, [windowWidth]);

  useEffect(() => {
    // console.log('products or swymWishlistReady change!');
    if (swymWishlistReady && products && products.length > 0) {
      if (swymWishlistReady && window._swat && window._swat.initializeActionButtons) {
        window._swat.initializeActionButtons('.products-grid');
      }
    }
  }, [swymWishlistReady]);

  return (
    <>
      <div className="position-relative">
        <h2 className="text-center">{title}</h2>
        <a className="btn-view-all position-absolute" href={url}>
          View All
        </a>
      </div>
      <div className="collection-products">
        <ul
          className="products-grid product-listing product-list-grid ly__gr_items row flex-flow list-unstyled p-style-01"
          data-grid=" col-xs-6 col-sm-4 col-lg-3"
          data-layout="gr"
        >
          {products.map((product, index) => {
            let inCartQuantity = 0;
            if (product.variants && cart && cart.item_count > 0) {
              const variantId = product.variants[0].id;
              const matchItem = cart.items.find(({ variant_id }) => variantId === variant_id);
              inCartQuantity = matchItem ? matchItem.quantity : 0;
            }

            return (
              <GridItem
                key={product.id}
                index={index}
                product={product}
                windowWidth={windowWidth}
                discountBadge={discountBadge}
                mobileMode={mobileMode}
                inCartQuantity={inCartQuantity}
                liClass="col-6 col-sm-4 col-lg-2"
              />
            );
          })}
        </ul>
      </div>
    </>
  );
};

FeaturedProducts.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
};

export default FeaturedProducts;
