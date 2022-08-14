/* eslint-disable default-param-last */
import { RECEIVE_CART } from '@/react/pages/cart/actions';

const initialState = { ...window.tw_cart };

// update state by action
const cart = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_CART: {
      return action.cart;
    }
    default:
      return state;
  }
};

export default cart;
