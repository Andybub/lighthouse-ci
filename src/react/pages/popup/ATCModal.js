import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import './ATCModal.scss';
import SlideItem from '@/react/pages/product/SlideItem';
import { getCart } from '@/service/CartAPI';
import useCartCount from '@/react/hooks/useCartCount';

const ATCModal = ({ item }) => {
  const [cart, setCart] = useState(null);
  const [cabList, setCabList] = useState([]);
  const itemCount = useCartCount(cart);
  const modalRef = useRef();

  const handleClose = () => {
    const { EventEmitter, CLOSE_ADDED_CART } = window.TW.main;
    EventEmitter.emit(CLOSE_ADDED_CART);
  };

  useEffect(() => {
    getCart().then((data) => {
      setCart(data);
    });
  }, []);

  useEffect(() => {
    disableBodyScroll(modalRef.current);
    const { EventEmitter, CLOSE_ADDED_CART } = window.TW.main;
    EventEmitter.on(CLOSE_ADDED_CART, () => {
      enableBodyScroll(modalRef.current);
    });
  }, []);

  useEffect(() => {
    window.FastSimonSDK.productRecommendation({
      withAttributes: true,
      productID: item.product_id,
      specs: [
        {
          sources: ['related_purchase', 'related_cart', 'related_views'],
          maxSuggestions: 5,
          widgetID: 'atcmodal-cab-widget',
        },
      ],
      callback: ({ payload }) => {
        const [{ payload: products }] = payload;
        setCabList(
          products.map((product) => ({
            id: +product.id,
            variantId: product.vra[0][0],
            title: product.l,
            price: `$${product.p}`,
            regularPrice: `$${product.p_c}`,
            imageUrl: product.t,
            imageUrl2: product.t2,
            href: product.u,
          })),
        );
      },
    });
  }, []);

  return (
    <div className="modal-dialog m-0" ref={modalRef}>
      <div className="modal-content">
        <div className="modal-header justify-content-center">
          <p className="modal-title font-weight-bold">Added To Cart</p>
          <button type="button" className="close" aria-label="close" onClick={handleClose}>
            <i className="icomoon-close" />
          </button>
        </div>
        <div className="modal-body px-0 pb-0">
          <div className="product-content d-flex align-items-center mx-3 mx-sm-5 mb-3">
            <div className="product-image">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="product-info pl-3">
              <p className="product-title">{item.title}</p>
              <div className="lineitem-info">
                <span className="quantity">Quantity: {item.quantity}</span>
                <span className="price ml-3">Total: ${(item.final_line_price / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="cart-content d-flex flex-column align-items-center px-3 px-sm-5 py-3">
            <div className="cart-info mb-2">
              {!cart ? (
                'loading...'
              ) : (
                <>
                  <span className="item-count">Total Items in Cart : {itemCount}</span>
                  <span className="subtotal ml-5">${(cart.total_price / 100).toFixed(2)}</span>
                </>
              )}
            </div>
            <a className="gtm-go-to-cart btn btn-primary btn-block rounded-pill" href="/cart">
              Go To Cart
            </a>
            <button type="button" className="gtm-continue-shopping btn btn-link" onClick={handleClose}>
              <u>Continue Shopping</u>
            </button>
          </div>
          {!!cabList && cabList.length > 1 && (
            <div className="cab-container loading py-4 px-3 px-sm-5">
              <p className="cab-title font-weight-bold text-center">Customers Also Bought</p>
              <div className="cab-wrapper d-flex justify-content-start">
                {cabList.map((product) => (
                  <div className="cab-item" key={product.id}>
                    <SlideItem product={product} hoverDisabled />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ATCModal.propTypes = {
  item: PropTypes.shape({
    product_id: PropTypes.number.isRequired,
    variant_id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    final_price: PropTypes.number.isRequired,
    final_line_price: PropTypes.number.isRequired,
    properties: PropTypes.object,
  }).isRequired,
};

export default ATCModal;
