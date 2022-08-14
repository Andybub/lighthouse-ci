import inView from 'in-view';
import { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';

// Personalized
export * as Customizer from './Customizer';

// Review Image Modal
export * as ReviewsGalleryModal from './ReviewsGalleryModal';

// Shop The Look
export const initSTL = () => {
  inView('#tw-stl-app').once('enter', (el) => {
    const { dataset, style } = el;
    const { productId } = dataset;
    if (!productId) style.display = 'none';
    else {
      const STLApp = lazy(() =>
        import(
          /* webpackChunkName: 'product-stl' */
          /* webpackMode: 'lazy' */
          '@/react/pages/product/STLApp'
        ),
      );

      const stlRoot = createRoot(el);
      stlRoot.render(<STLApp productId={productId} />);
    }
  });
};

// Customer Also Bought
export const initCAB = () => {
  const domId = 'tw-cab-app';
  inView(`#${domId}`).once('enter', (el) => {
    const { dataset, style } = el;
    const { productId } = dataset;
    if (!productId) style.display = 'none';
    else {
      const CABApp = lazy(() =>
        import(
          /* webpackChunkName: 'product-cab' */
          /* webpackMode: 'lazy' */
          '@/react/pages/product/CABApp'
        ),
      );

      const cabRoot = createRoot(el);
      cabRoot.render(<CABApp productId={productId} rootId={domId} />);
    }
  });
};

// Recently Viewed
export const initRV = () => {
  const MIN = 8;
  const MAX = 20;
  const domId = 'tw-rv-app';
  const { dataset, style } = document.getElementById('tw-rv-app');
  const { productId, image, handle, title, price, regularPrice } = dataset;
  const currentProduct = {
    product_id: productId,
    image_url: image,
    handle,
    title,
    price,
    compare_at_price_max: regularPrice,
  };
  const { localStorage } = window;
  const jsonRecentlyViewed = localStorage.getItem('isp_recently_viewd') || '[]';
  const arrayRecentlyViewed = JSON.parse(jsonRecentlyViewed).filter(({ product_id: id }) => id !== productId);
  if (arrayRecentlyViewed.length > MAX) arrayRecentlyViewed.length = MAX;
  arrayRecentlyViewed.unshift(currentProduct);
  localStorage.setItem('isp_recently_viewd', JSON.stringify(arrayRecentlyViewed));
  const appSource = arrayRecentlyViewed.filter(({ product_id: id }) => id !== productId);
  const { length } = appSource;
  console.log(`RV --> ${length}`);
  if (length < MIN) style.display = 'none';
  else {
    inView(`#${domId}`).once('enter', (el) => {
      const RVApp = lazy(() =>
        import(
          /* webpackChunkName: 'product-rv' */
          /* webpackMode: 'lazy' */
          '@/react/pages/product/RVApp'
        ),
      );

      const rvRoot = createRoot(el);
      rvRoot.render(<RVApp source={appSource} rootId={domId} />);
    });
  }
};
