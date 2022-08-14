import { createRoot } from 'react-dom/client';
import WishlistApp from '@/react/pages/swym-wishlist/WishlistApp';
import { getProductsById } from './service/ProductAPI';
import { getCookieValue } from './utils/Cookies';

const initWishlistApp = (wishlist) => {
  const idList = wishlist.map(({ empi }) => empi).filter((id, key, arr) => arr.indexOf(id) === key);
  getProductsById(idList, 'swym-wishlist').then((result) => {
    const data = wishlist.map((item) => {
      const product = result.find(({ id }) => id === item.empi);
      const variant = product.variants.find(({ id }) => id === item.epi);
      return { ...item, product, variant };
    });
    const dom = document.getElementById('tw-swym-wishlist-app');
    const root = createRoot(dom);
    root.render(<WishlistApp data={data} />);
  });
};

$(() => {
  const email = getCookieValue('swym-email');
  window.SwymCallbacks = window.SwymCallbacks || [];
  window.SwymCallbacks.push(() => {
    const { _swat: swat } = window;
    swat.fetch(initWishlistApp);
  });
});
