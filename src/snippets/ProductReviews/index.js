import { createRoot } from 'react-dom/client';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { lazy } from 'react';
import reducer from './reducers';
import { fetchProductInfo, fetchRatingsSummary, fetchGallery, fetchReviewsList, fetchQuestionsList } from './actions';

export const initReviews = () => {
  // console.log('initReviews');

  // TODO IntersectionObserver
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

  const dom = document.getElementById('tw-react-reviews');
  const root = createRoot(dom);

  const params = new URL(window.location.href).searchParams;
  const reviewId = params.get('stamped_r_id');
  if (reviewId) {
    setTimeout(() => {
      document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      // isIntersecting is true when element and viewport are overlapping
      // isIntersecting is false when element and viewport don't overlap
      if (entries[0].isIntersecting === true) {
        // console.log('Element has just become visible in screen');
        observer.unobserve(entries[0].target);
        const ProductReviews = lazy(() =>
          import(
            /* webpackChunkName: 'product-review' */
            /* webpackMode: 'lazy' */
            '@/snippets/ProductReviews/ProductReviews'
          ),
        );
        root.render(
          <Provider store={store}>
            <ProductReviews />
          </Provider>,
        );

        store.dispatch(fetchProductInfo({ ...dom.dataset }));
        store.dispatch(fetchRatingsSummary());
        store.dispatch(fetchGallery({ page: 1, itemsPerPage: 30 }));
        store.dispatch(fetchReviewsList({ sortReviews: 'photos' }));
        store.dispatch(fetchQuestionsList());
      }
    },
    { rootMargin: '0px' },
  );

  observer.observe(dom);
};
