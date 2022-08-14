import './FeaturedProducts.scss';
import { createRoot } from 'react-dom/client';
import { lazy } from 'react';

const jsonDom = document.getElementById('tw-featured-products-json');
const products = JSON.parse(jsonDom.textContent);

const mainDom = document.getElementById('react-featured-products');
const { title, url } = mainDom.dataset;

const dom = document.getElementById('react-featured-products');
const observer = new IntersectionObserver(
  (entries) => {
    // isIntersecting is true when element and viewport are overlapping
    // isIntersecting is false when element and viewport don't overlap
    if (entries[0].isIntersecting === true) {
      // console.log('Element has just become visible in screen');
      observer.unobserve(entries[0].target);
      const FeaturedProducts = lazy(() =>
        import(
          /* webpackChunkName: 'homepage-featured-products' */
          /* webpackMode: 'lazy' */
          './FeaturedProducts'
        ),
      );
      const root = createRoot(dom);
      root.render(<FeaturedProducts title={title} url={url} products={products} />);
    }
  },
  { rootMargin: '0px' },
);

observer.observe(document.querySelector('#react-featured-products'));
