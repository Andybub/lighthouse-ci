import { CHANGE_LOADING, TOGGLE_MODAL_DETAIL } from '../actions';

const initialState = {
  loading: false,
  modalDetail: {
    status: false,
  },
  modalGallery: {
    status: false,
  },
};

const common = (state = initialState, action = '') => {
  switch (action.type) {
    case CHANGE_LOADING:
      return {
        ...state,
        loading: action.value,
      };
    case TOGGLE_MODAL_DETAIL: {
      return {
        ...state,
        modalDetail: {
          ...action.data,
        },
      };
    }
    default:
      return state;
  }
};

export default common;
