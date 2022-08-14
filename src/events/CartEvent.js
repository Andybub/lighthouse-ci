import { createRoot } from 'react-dom/client';
import ATCModal from '@/react/pages/popup/ATCModal';
import { updateCartData } from '@/service/CartAPI';
import { setPersistentCart } from '@/service/CartKeeper';
import { requestIdleCallback } from '@/utils/Polyfills';

const CART_LOADED = 'cart-loaded';
const CART_ADDED = 'cart-added';
const CART_UPDATED = 'cart-updated';
const POPUP_ADDED_CART = 'popup-added-cart';
const CLOSE_ADDED_CART = 'close-added-cart';

const init = () => {
  let root;

  const dom = document.getElementById('add-to-cart-modal');

  const { EventEmitter } = window.TW.main;

  $(dom).on('click', ({ target, currentTarget }) => {
    if (target === currentTarget && !!root) {
      EventEmitter.emit(CLOSE_ADDED_CART);
    }
  });

  // eslint-disable-next-line camelcase
  const { KT_onCartUpdate, KT_onItemAdded, KT_getCart } = window.Shopify;

  window.Shopify.KT_onCartUpdate = (cart, remove) => {
    console.log('onCartUpdated', cart, remove);
    EventEmitter.emit(CART_UPDATED, cart);
    KT_onCartUpdate(cart, remove);
    // fix cart item count
    const count = cart.items.reduce((prev, { handle, quantity }) => {
      return prev + (handle === 'personalized-rush-production-time' ? 0 : quantity);
    }, 0);
    document.querySelector('.cartCount').textContent = count;
  };

  window.Shopify.KT_onItemAdded = (item) => {
    console.log('onCartAdded', item);
    EventEmitter.emit(CART_ADDED, item);
    EventEmitter.emit(POPUP_ADDED_CART, item);
    KT_onItemAdded(item);
  };

  EventEmitter.on(POPUP_ADDED_CART, (item) => {
    if (root) return;
    root = createRoot(dom);
    root.render(<ATCModal item={item} />);
    dom.classList.replace('d-none', 'd-flex');
    requestIdleCallback(() => {
      dom.classList.add('show');
    });
  });

  EventEmitter.on(CLOSE_ADDED_CART, () => {
    if (!root) return;
    dom.classList.remove('show');
    setTimeout(() => {
      dom.classList.replace('d-flex', 'd-none');
      root.unmount();
      root = null;
    }, 300);
  });

  EventEmitter.on(CART_UPDATED, (cart) => {
    const { customerId } = document.getElementById('tw-main-script').dataset;
    if (!customerId) return;
    const tokenSaved = Object.keys(cart.attributes).includes('token_saved');
    if (tokenSaved) return;
    updateCartData({ attributes: { token_saved: true } })
      .then(() => setPersistentCart(customerId, cart))
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  });

  KT_getCart((cart) => {
    console.log('onCartLoaded', cart);
    EventEmitter.emit(CART_LOADED, cart);
  });
};

export default {
  CART_LOADED,
  CART_ADDED,
  CART_UPDATED,
  POPUP_ADDED_CART,
  CLOSE_ADDED_CART,
  init,
};
