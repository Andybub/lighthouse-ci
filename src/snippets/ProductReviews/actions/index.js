import {
  getReviewRatingsSummary,
  getGallery,
  getProductReviews,
  getSingleReview,
  getReviewCarouselPhotos,
  getProductQuestions,
  createReview,
  createQuestion,
  voteReview,
  voteQuestion,
} from '@/service/ReviewsAPI';
import { formatReview } from '@/utils/Stamped';

export const CHANGE_LOADING = 'CHANGE_LOADING';
export const CHANGE_GALLERY_LOADING = 'CHANGE_GALLERY_LOADING';
export const CHANGE_MAKE_REVIEW_LOADING = 'CHANGE_MAKE_REVIEW_LOADING';
export const CHANGE_MAKE_QUESTION_LOADING = 'CHANGE_MAKE_QUESTION_LOADING';
export const RECEIVE_PRODUCT_INFO = 'RECEIVE_PRODUCT_INFO';
export const RECEIVE_BADGE = 'RECEIVE_BADGE';
export const RECEIVE_GALLERY = 'RECEIVE_GALLERY';
export const RECEIVE_REVIEWS_CAROUSEL_PHOTOS = 'RECEIVE_REVIEWS_CAROUSEL_PHOTOS';
export const RECEIVE_REVIEWS_LIST = 'RECEIVE_REVIEWS_LIST';
export const RECEIVE_QUESTIONS_LIST = 'RECEIVE_QUESTIONS_LIST';
export const CREATED_REVIEW_SUCCESS = 'CREATED_REVIEW_SUCCESS';
export const CREATED_QUESTION_SUCCESS = 'CREATED_QUESTION_SUCCESS';
export const UPDATE_REVIEWS_LIST_PARAMS = 'UPDATE_REVIEWS_LIST_PARAMS';
export const UPDATE_QUESTIONS_LIST_PARAMS = 'UPDATE_QUESTIONS_LIST_PARAMS';
export const RECEIVE_VOTE_REVIEW_RESULT = 'RECEIVE_VOTE_REVIEW_RESULT';
export const RECEIVE_VOTE_QUESTION_RESULT = 'RECEIVE_VOTE_QUESTION_RESULT';
export const TOGGLE_MODAL_DETAIL = 'TOGGLE_MODAL_DETAIL';

export const fetchProductInfo = ({ productId, productSku, productName, productUrl, productImageUrl }) => {
  return (dispatch) => {
    dispatch({
      type: RECEIVE_PRODUCT_INFO,
      product: { productId, productSku, productName, productUrl, productImageUrl },
    });
  };
};

export const fetchRatingsSummary = () => {
  return (dispatch, getState) => {
    const { productId, productSku } = getState().data.product;
    // dispatch(changeLoading(true));
    getReviewRatingsSummary({ productId, productSku })
      .then((response) => {
        // console.log(response);
        dispatch({
          type: RECEIVE_BADGE,
          badge: response[0],
        });
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          dispatch(fetchRatingsSummary());
        }, 3000);
      })
      .finally(() => {
        // dispatch(changeLoading(false));
      });
  };
};

export const changeGalleryLoading = (value) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE_GALLERY_LOADING,
      galleryLoading: value,
    });
  };
};

export const fetchGallery = ({ page = 1, itemsPerPage = 30 }) => {
  return (dispatch, getState) => {
    // console.log('fetchGallery', page, itemsPerPage);
    const { productId, productSku } = getState().data.product;
    dispatch(changeGalleryLoading(true));
    getGallery({ productId, productSku, page, itemsPerPage })
      .then((response) => {
        console.log(response);
        dispatch({
          type: RECEIVE_GALLERY,
          gallery: response,
        });
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          dispatch(fetchGallery({ page, itemsPerPage }));
        }, 3000);
      })
      .finally(() => {
        dispatch(changeGalleryLoading(false));
      });
  };
};

export const changeMakeReviewLoading = (value) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE_MAKE_REVIEW_LOADING,
      makeReviewLoading: value,
    });
  };
};

export const makeReview = (form) => {
  return (dispatch, getState) => {
    dispatch(changeMakeReviewLoading(true));
    createReview({ ...getState().data.product, ...form })
      .then((response) => {
        console.log(response);
        if (response.id) {
          dispatch({
            type: CREATED_REVIEW_SUCCESS,
            reviewCreated: true,
          });
        } else {
          throw new Error('Review not created');
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        dispatch(changeMakeReviewLoading(false));
      });
  };
};

export const changeMakeQuestionLoading = (value) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE_MAKE_QUESTION_LOADING,
      makeQuestionLoading: value,
    });
  };
};

export const makeQuestion = (form) => {
  return (dispatch, getState) => {
    dispatch(changeMakeQuestionLoading(true));
    createQuestion({ ...getState().data.product, ...form })
      .then((response) => {
        console.log(response);
        if (response === '3') {
          dispatch({
            type: CREATED_QUESTION_SUCCESS,
            questionCreated: true,
          });
        } else {
          throw new Error('Question not created');
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        dispatch(changeMakeQuestionLoading(false));
      });
  };
};

export const fetchReviewsList = (params) => {
  return async (dispatch, getState) => {
    // dispatch(changeLoading(true));
    const result = await getProductReviews({ ...getState().data.product, ...params })
      .then((response) => {
        dispatch({
          type: UPDATE_REVIEWS_LIST_PARAMS,
          data: {
            page: 1,
            take: 10,
            ...params,
          },
        });
        dispatch({
          type: RECEIVE_REVIEWS_LIST,
          data: response,
        });
        return response;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        // dispatch(changeLoading(false));
      });
    return result;
  };
};

export const fetchReviewsCarouselPhotos = (params) => {
  return (dispatch) => {
    // dispatch(changeLoading(true));
    getReviewCarouselPhotos(params)
      .then((response) => {
        dispatch({
          type: RECEIVE_REVIEWS_CAROUSEL_PHOTOS,
          data: response,
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        // dispatch(changeLoading(false));
      });
  };
};

export const toggleModalDetail = (data) => ({
  type: TOGGLE_MODAL_DETAIL,
  data,
});

export const fetchSingleReview = (reviewId) => {
  console.log('fetchSingleReview', reviewId);
  return (dispatch) => {
    // dispatch(changeLoading(true));
    getSingleReview({ reviewId })
      .then((response) => {
        console.log(response);
        if (response.data) {
          dispatch(toggleModalDetail({ status: true, data: formatReview(response.data), activeIndex: 0 }));
        } else {
          throw new Error('Review not found');
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        // dispatch(changeLoading(false));
      });
  };
};

export const fetchQuestionsList = (params) => {
  return (dispatch, getState) => {
    // dispatch(changeLoading(true));
    const { productId } = getState().data.product;
    getProductQuestions({ productId, ...params })
      .then((response) => {
        dispatch({
          type: UPDATE_QUESTIONS_LIST_PARAMS,
          data: {
            page: 1,
            ...params,
          },
        });
        dispatch({
          type: RECEIVE_QUESTIONS_LIST,
          data: response,
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        // dispatch(changeLoading(false));
      });
  };
};

export const makeVoteReview = (data) => {
  return async (dispatch, getState) => {
    const { productId } = getState().data.product;
    await voteReview({ productId, ...data })
      .then((response) => {
        dispatch({
          type: RECEIVE_VOTE_REVIEW_RESULT,
          data: response,
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        // dispatch(changeLoading(false));
      });
  };
};

export const makeVoteQuestion = (data) => {
  return async (dispatch, getState) => {
    const { productId } = getState().data.product;
    await voteQuestion({ productId, ...data })
      .then((response) => {
        dispatch({
          type: RECEIVE_VOTE_QUESTION_RESULT,
          data: response,
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        // dispatch(changeLoading(false));
      });
  };
};
