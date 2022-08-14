import './CartApp.scss';
import './ShippingRatesCalculator.scss';
import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DiscountBanner from '@/react/pages/cart/components/DiscountBanner';
import PaymentBox from '@/react/pages/cart/components/PaymentBox';
import ItemContainer from '@/react/pages/cart/containers/ItemContainer';
import EmptyCart from '@/react/pages/cart/components/EmptyCart';
// import Loading from '@/react/pages/cart/components/Loading';
import { actionClearCart } from '@/react/pages/cart/actions';

const CartApp = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    const calculator = document.getElementsByClassName('cbb-shipping-rates-calculator')[0];
    if (calculator) {
      if (cart && cart.item_count > 0) {
        calculator.style.display = 'block';
      } else {
        calculator.style.display = 'none';
      }
    }
  }, [cart]);

  const handleClearCart = useCallback(() => {
    dispatch(actionClearCart());
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  if (cart && cart.item_count > -1) {
    return (
      <div className="tw-react-cart">
        {cart.item_count > 0 ? (
          <form action="/cart" method="post" noValidate className="cart">
            <div className={`${cart.item_count < 3 ? 'd-none' : 'd-block'} d-lg-none`}>
              <PaymentBox id="top-cart-payment-box" cart={cart} />
            </div>
            <div className="main-container row justify-content-between align-items-start">
              <div className="d-none d-lg-block col-12 mt-3">{window.TW.DiscountBanner && <DiscountBanner />}</div>
              <div className="col-12 col-lg-8">
                <div className="d-block d-lg-none">{window.TW.DiscountBanner && <DiscountBanner />}</div>
                {cart.item_count < 3 && <p className="page-title">Shopping Cart</p>}
                <div className="items-container row">
                  <ItemContainer />
                </div>
                <input
                  onClick={handleClearCart}
                  type="button"
                  name="clear"
                  className="gtm-clear-cart btn-clear-cart rounded-pill border-0"
                  value="Clear Cart"
                />
              </div>
              <PaymentBox
                id="sticky-cart-payment-box"
                cart={cart}
                additionalClass="col-12 col-lg-4"
                showReviewBadge
                maxLimit={3}
                showExpressCheckout
              />
            </div>
            {/* <Loading/> */}
          </form>
        ) : (
          <EmptyCart />
        )}
      </div>
    );
  }
  return (
    <div className="tw-react-cart">
      <div className="loading d-flex justify-content-center align-items-center">Loading...</div>
    </div>
  );
};

export default CartApp;
