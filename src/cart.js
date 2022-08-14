import { createRoot } from 'react-dom/client';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import CartApp from '@/react/pages/cart';
import reducer from '@/react/pages/cart/reducers';
import { fetchCart } from '@/react/pages/cart/actions';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
store.dispatch(fetchCart());

const dom = document.getElementById('react-cart');
const root = createRoot(dom);
root.render(
  <Provider store={store}>
    <CartApp />
  </Provider>,
);

$(() => {
  // ISP Tracking
  // https://docs.fastsimon.com/sdk/docs/events/cart#cart-page-visited
  window.FastSimonSDK.event({
    reportAppType: window.FastSimonAppType.SinglePage, // no redirect report now
    eventName: window.FastSimonEventName.CartVisited,
    data: {}, // (Required)
  });
});
