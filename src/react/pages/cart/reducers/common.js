import { CHANGE_LOADING } from '@/react/pages/cart/actions';

const initialState = {
  loading: false,
};

const common = (state = initialState, action = '') => {
  switch (action.type) {
    case CHANGE_LOADING:
      return {
        ...state,
        loading: action.value,
      };

    default:
      return state;
  }
};

export default common;
