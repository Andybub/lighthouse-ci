import { createRoot } from 'react-dom/client';
import CKModal from '@/react/pages/popup/CKModal';
import { getCart, addCart, clearCart, updateCartData } from '@/service/CartAPI';
import { getPersistentCart, setPersistentCart } from '@/service/CartKeeper';
import { getCookieValue, setCookieLimitDays, setCookieNeverExpire, setCookieExpired } from '@/utils/Cookies';
import { requestIdleCallback } from '@/utils/Polyfills';

const saveCartToKeeper = (customerId, cartData) => {
  return Promise.resolve()
    .then(() => updateCartData({ attributes: { token_saved: true } }))
    .then(() => setPersistentCart(customerId, cartData))
    .then((result) => console.log(result))
    .catch((error) => console.log(error));
};

const loadCartByToken = (token, disableReload = false) => {
  setCookieExpired('cart');
  setCookieExpired('cart_sig');
  setCookieExpired('cart_ts');
  setCookieNeverExpire('cart', token);
  return Promise.resolve()
    .then(() => updateCartData({ token }))
    .then((result) => {
      console.log('loadCartByToken', result);
      if (!disableReload) window.location.reload();
    })
    .catch((error) => console.error(error));
};

const loadCartByJson = (json, disableReload = false) => {
  const { items, attributes, notes } = JSON.parse(json);
  return Promise.resolve()
    .then(() => updateCartData({ attributes, notes }))
    .then(() => addCart(items.map(({ variant_id: id, quantity, properties }) => ({ id, quantity, properties }))))
    .then((result) => {
      console.log('loadCartByJson', result);
      if (!disableReload) window.location.reload();
    })
    .catch((error) => console.error(error));
};

const loadCartFromKeeper = ({ cartToken, cartJson }) => {
  if (cartToken) loadCartByToken(cartToken);
  else loadCartByJson(cartJson);
};

const mergeCartWithKeeper = (customerId, cartData, { cartToken, cartJson }) => {
  Promise.resolve()
    .then(() => {
      if (!cartToken) return loadCartByJson(cartJson, true);
      const items = cartData.items.map(({ id, quantity, properties }) => ({ id, quantity, properties }));
      return loadCartByToken(cartToken, true).then(() => addCart(items));
    })
    .then(() => getCart())
    .then((cart) => saveCartToKeeper(customerId, cart))
    .then(() => window.location.reload());
};

const popupCartKeeperModal = () =>
  new Promise((resolve) => {
    const { customerName } = document.getElementById('tw-main-script').dataset;
    const dom = document.getElementById('cart-keeper-modal');
    const root = createRoot(dom);

    const handleClose = (option = '') => {
      dom.classList.remove('show');
      setTimeout(() => {
        dom.classList.replace('d-flex', 'd-none');
        root.unmount();
        resolve(option);
      }, 300);
    };

    root.render(
      <CKModal
        customer={customerName}
        keepCart={() => handleClose('keep-the-cart')}
        loadCart={() => handleClose('load-saved-cart')}
        mergeCarts={() => handleClose('merge-carts')}
        closeModal={() => handleClose()}
      />,
    );

    dom.classList.replace('d-none', 'd-flex');
    requestIdleCallback(() => {
      dom.classList.add('show');
    });
  });

export const init = () => {
  const { template, customerId } = document.getElementById('tw-main-script').dataset;
  if (!template.includes('/account')) return;

  const cookieLoginId = getCookieValue('logged_in');
  if (!cookieLoginId || cookieLoginId !== customerId) {
    setCookieLimitDays('logged_in', customerId, 15);
    getPersistentCart(customerId).then((result) => {
      console.log('getPersistentCart', result);
      getCart().then((cartData) => {
        const { item_count: itemCount } = cartData;
        if (typeof result === 'string') {
          if (itemCount) saveCartToKeeper(customerId, cartData);
          return;
        }
        if (!itemCount) loadCartFromKeeper(result);
        else {
          popupCartKeeperModal(cartData, result).then((option) => {
            switch (option) {
              case 'keep-the-cart':
                saveCartToKeeper(customerId, cartData);
                break;
              case 'load-saved-cart':
                clearCart().then(() => loadCartFromKeeper(result));
                break;
              case 'merge-carts':
                mergeCartWithKeeper(customerId, cartData, result);
                break;
              default:
            }
          });
        }
      });
    });
  }
};
