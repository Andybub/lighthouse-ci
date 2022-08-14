/* eslint-disable default-param-last */
import {
  RECEIVE_PRODUCT_INFO,
  RECEIVE_BADGE,
  CHANGE_GALLERY_LOADING,
  CHANGE_MAKE_REVIEW_LOADING,
  CHANGE_MAKE_QUESTION_LOADING,
  RECEIVE_GALLERY,
  CREATED_REVIEW_SUCCESS,
  CREATED_QUESTION_SUCCESS,
  UPDATE_REVIEWS_LIST_PARAMS,
  RECEIVE_REVIEWS_CAROUSEL_PHOTOS,
  RECEIVE_REVIEWS_LIST,
  UPDATE_QUESTIONS_LIST_PARAMS,
  RECEIVE_QUESTIONS_LIST,
  RECEIVE_VOTE_REVIEW_RESULT,
  RECEIVE_VOTE_QUESTION_RESULT,
} from '../actions';

const initialState = {
  gallery: {
    page: 1,
    data: [],
    total: 0,
    loading: false,
  },
  makeReviewLoading: false,
  makeQuestionLoading: false,
};

// update state by action
const data = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_PRODUCT_INFO: {
      return {
        ...state,
        product: action.product,
      };
    }
    case RECEIVE_BADGE: {
      return {
        ...state,
        badge: action.badge,
      };
    }
    case CHANGE_GALLERY_LOADING: {
      return {
        ...state,
        gallery: { ...state.gallery, loading: action.galleryLoading },
      };
    }
    case CHANGE_MAKE_REVIEW_LOADING: {
      return {
        ...state,
        makeReviewLoading: action.makeReviewLoading,
      };
    }
    case CHANGE_MAKE_QUESTION_LOADING: {
      return {
        ...state,
        makeQuestionLoading: action.makeQuestionLoading,
      };
    }
    case RECEIVE_GALLERY: {
      return {
        ...state,
        gallery: {
          ...state.gallery,
          page: action.gallery.page,
          data: [...state.gallery.data, ...action.gallery.data],
          total: action.gallery.total,
        },
      };
    }
    case RECEIVE_REVIEWS_CAROUSEL_PHOTOS: {
      return {
        ...state,
        reviewsCarouselPhotos: action.data,
      };
    }
    case UPDATE_REVIEWS_LIST_PARAMS: {
      return {
        ...state,
        reviewListParams: action.data,
      };
    }
    case RECEIVE_REVIEWS_LIST: {
      return {
        ...state,
        reviewsList: action.data,
      };
    }
    case RECEIVE_VOTE_REVIEW_RESULT: {
      return {
        ...state,
        voteReview: action.data,
      };
    }
    case UPDATE_QUESTIONS_LIST_PARAMS: {
      return {
        ...state,
        questionsListParams: action.data,
      };
    }
    case RECEIVE_QUESTIONS_LIST: {
      return {
        ...state,
        questionsList: action.data,
      };
    }
    case RECEIVE_VOTE_QUESTION_RESULT: {
      return {
        ...state,
        voteQuestion: action.data,
      };
    }
    case CREATED_REVIEW_SUCCESS: {
      return {
        ...state,
        reviewCreated: action.reviewCreated,
      };
    }
    case CREATED_QUESTION_SUCCESS: {
      return {
        ...state,
        questionCreated: action.questionCreated,
      };
    }
    default:
      return state;
  }
};

export default data;
