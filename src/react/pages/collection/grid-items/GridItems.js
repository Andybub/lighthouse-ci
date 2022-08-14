import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getBadge } from '@/utils/DiscountBadge';
import GridItem from './GridItem';

const GridItems = (props) => {
  // console.log('GridItems');
  const { realPayload, windowWidth, mobileMode, relatedPayload } = props;
  const [products, setProducts] = useState([]);
  const [discountBadge, setDiscountBadge] = useState(null);
  const [swymWishlistReady, setSwymWishlistReady] = useState(false);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    if (mobileMode && relatedPayload && relatedPayload.products) {
      setProducts(relatedPayload.products);
    } else if (realPayload && realPayload.products) {
      setProducts(realPayload.products);
    }
  }, [mobileMode, realPayload, relatedPayload]);

  useEffect(() => {
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
    // console.log('products or swymWishlistReady change!');
    if (swymWishlistReady && realPayload.products && realPayload.products.length > 0) {
      if (swymWishlistReady && window._swat && window._swat.initializeActionButtons) {
        window._swat.initializeActionButtons('.products-grid');
      }
    }
  }, [realPayload, swymWishlistReady]);

  return (
    <div className="collection-products" data-section-id="collection-template">
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
            />
          );
        })}
      </ul>
    </div>
  );
};

GridItems.propTypes = {
  realPayload: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired,
  mobileMode: PropTypes.bool.isRequired,
  relatedPayload: PropTypes.object,
};

GridItems.defaultProps = {
  relatedPayload: null,
};

export default GridItems;
