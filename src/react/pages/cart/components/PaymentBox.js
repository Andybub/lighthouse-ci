import './PaymentBox.scss';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import MotivatorMessage from '@/react/pages/cart/components/MotivatorMessage';
import useCartCount from '@/react/hooks/useCartCount';

const PaymentBox = (props) => {
  // eslint-disable-next-line no-unused-vars
  const { cart, id, additionalClass, showReviewBadge, maxLimit, showExpressCheckout } = props;
  const totalPrice = (cart.total_price / 100).toFixed(2);
  const [saving, setSaving] = useState(0);
  const itemCount = useCartCount(cart);
  const { additionalCheckoutButtons, contentForAdditionalCheckoutButtons } = window;
  const domRef = useRef();

  useEffect(() => {
    if (showReviewBadge) {
      // https://support.stamped.io/article/833-loading-stamped-ios-widgets-with-ajax
      const checkId = setInterval(() => {
        if (window.StampedFn) {
          window.StampedFn.reloadUGC();
          clearInterval(checkId);
        }
      }, 3000);
    }
  }, []);

  useEffect(() => {
    if (cart && cart.total_discount) {
      setSaving(cart.total_discount);
    }
  }, [cart]);

  useEffect(() => {
    let checkId;
    if (domRef && domRef.current) {
      const rearranged = domRef.current.classList.contains('payment-rearranged');
      if (!rearranged) {
        checkId = setInterval(() => {
          const domLis = domRef.current.querySelectorAll('.shopify-cleanslate li');
          if (domLis.length > 0) {
            domLis.forEach((li) => {
              if (li.querySelector('[data-testid="ShopifyPay-button"]')) {
                li.classList.add('shopify-pay-button');
              } else if (li.querySelector('[data-testid="ApplePay-button"]')) {
                li.classList.add('apple-pay-button');
              } else if (li.querySelector('[title="Checkout with PayPal"]')) {
                li.classList.add('pay-pal-button');
              }
            });
            domRef.current.classList.add('payment-rearranged');
            clearInterval(checkId);
            checkId = null;
          }
        }, 1000);
      }
    }
    return () => {
      if (checkId) {
        clearInterval(checkId);
      }
    };
  }, [domRef]);

  /** Loading Animation */
  const atClick = () => {
    const loadingTargets = document.getElementsByClassName('btn-checkout');
    loadingTargets.forEach((el) => {
      el.classList.add('btn-loading');
    });
  };

  return (
    <div className={`payment-box-container ${additionalClass}`} id={id}>
      <div className="payment-box">
        <div className="payment-info">
          <div className="payment-info-top d-flex justify-content-between">
            <p className="">
              Cart Total{' '}
              <span>
                (<span className="txt-items-count">{itemCount}</span> Items)
              </span>
            </p>
            <p className="txt-total-price">${totalPrice}</p>
          </div>
          {saving > 0 && (
            <p className="txt-subtotal-savings text-center mb-1">{`You're saving $${(saving / 100).toFixed(2)}`}</p>
          )}
          <MotivatorMessage cart={cart} />
          <button
            type="submit"
            name="checkout"
            className={`btn-checkout gtm-checkout w-100 border-0 rounded-pill ${!showExpressCheckout ? 'mb-3' : ''}`}
            onClick={atClick}
          >
            <span>Checkout</span>
            <div className="loading-animation">
              <div className="loading-icon">
                <div className="shanxing">
                  <div className="sx1" />
                  <div className="sx2" />
                </div>
              </div>
              <i className="icomoon icomoon-lock" />
            </div>
          </button>
          {showExpressCheckout && (
            <div>
              {additionalCheckoutButtons && (
                <div className="additional-checkout-container position-relative border-top">
                  <p className="position-absolute text-center pl-3 pr-3 bg-white">Express Checkout</p>
                  <div
                    className="additional-checkout-buttons"
                    ref={domRef}
                    dangerouslySetInnerHTML={{ __html: contentForAdditionalCheckoutButtons }}
                  />
                </div>
              )}
            </div>
          )}
          <p className="txt-after-additional-checkout text-center">
            Shipping, taxes, and discounts will be calculated at checkout.
          </p>
          {showExpressCheckout && (
            <div className="payment-method-container d-flex justify-content-between d-lg-none">
              <img data-src={`${window.TW.assetPath}icon_payment_applepay.svg`} className="lazyload" alt="" />
              <img data-src={`${window.TW.assetPath}icon_payment_visa.svg`} className="lazyload" alt="" />
              <img data-src={`${window.TW.assetPath}icon_payment_master.svg`} className="lazyload" alt="" />
              <img data-src={`${window.TW.assetPath}icon_payment_ae.svg`} className="lazyload" alt="" />
              <img data-src={`${window.TW.assetPath}icon_payment_diner.svg`} className="lazyload" alt="" />
              <img data-src={`${window.TW.assetPath}icon_payment_discover.svg`} className="lazyload" alt="" />
              <img data-src={`${window.TW.assetPath}icon_payment_jcb.svg`} className="lazyload" alt="" />
            </div>
          )}
        </div>
        {showReviewBadge && (
          <div className="row d-lg-flex justify-content-center">
            <a
              className="btn-stamped-reviews-widget col-6"
              href="https://www.efavormart.com/pages/all-customer-reviews"
              target="_blank"
              rel="noreferrer"
            >
              <div
                id="stamped-reviews-widget"
                data-widget-type="site-badge"
                data-color-outer="#663366"
                data-color-inner="#a287b6"
                data-color-ribbon="#663366"
              />
            </a>
            <a
              className="btn-bbb col-6"
              href="https://www.bbb.org/us/ca/city-of-industry/profile/party-supplies/ya-ya-creations-1216-13186051#bbbseal"
              target="_blank"
              rel="noreferrer"
            >
              <img data-src={`${window.TW.assetPath}bbblogo.png`} className="lazyload" alt="" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

PaymentBox.propTypes = {
  cart: PropTypes.object.isRequired,
  id: PropTypes.string,
  additionalClass: PropTypes.string,
  showReviewBadge: PropTypes.bool,
  maxLimit: PropTypes.number,
  showExpressCheckout: PropTypes.bool,
};

PaymentBox.defaultProps = {
  id: '',
  additionalClass: '',
  showReviewBadge: false,
  maxLimit: 0,
  showExpressCheckout: false,
};

export default PaymentBox;
