import inView from 'in-view';
import { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './scss/article.scss';

// Shop The Look
export const initSTL = () => {
  inView('#tw-stl-app').once('enter', (el) => {
    const { dataset, style } = el;
    const { skusId } = dataset;
    if (!skusId) style.display = 'none';
    else {
      const STLApp = lazy(() =>
        import(
          /* webpackChunkName: 'product-stl' */
          /* webpackMode: 'lazy' */
          '@/react/pages/article/STLApp'
        ),
      );

      const stlRoot = createRoot(el);
      stlRoot.render(<STLApp skusId={skusId} />);
    }
  });
};

$(() => {
  initSTL();
});
