import { combineReducers } from 'redux';
import common from '@/react/pages/cart/reducers/common';
import cart from '@/react/pages/cart/reducers/cart';

const reducers = combineReducers({
  common,
  cart,
});

// flow
// export type StoreTypes = ReturnType<typeof reducers>;

export default reducers;
