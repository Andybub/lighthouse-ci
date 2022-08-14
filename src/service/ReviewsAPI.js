import { createAxiosInstance } from '@/react/api/axiosInstance';

const {
  API_KEY: stampedApiKey,
  STORE_HASH: stampedStoreHash,
  STORE_URL: stampedStoreUrl,
  SHOP_URL: stampedShopUrl,
} = window.TW.STAMPED;

const stampedURL = 'https://stamped.io/api/';
const yayaURL = 'https://review-api-uat.efmt.app/';

const stampedInstance = createAxiosInstance({ baseURL: stampedURL });
const yayaInstance = createAxiosInstance({ baseURL: yayaURL });

export const getSiteWideReviewSummary = () =>
  stampedInstance.post('/widget/reviews/batch', {
    data: [
      {
        type: 'carousel',
        apiKey: stampedApiKey,
        storeUrl: stampedStoreUrl,
      },
    ],
  });

export const getReviewRatingsSummary = ({ productId, productSku }) =>
  stampedInstance.post('/widget/badges?isIncludeBreakdown=true&isincludehtml=false', {
    productIds: [{ productId, productSku }],
    apiKey: stampedApiKey,
    storeUrl: stampedStoreUrl,
  });

export const getGallery = ({ productId, productSku, page = 1, itemsPerPage = 8 }) => {
  console.log('getGallery', productId, productSku, page, itemsPerPage);
  return stampedInstance.get('widget/reviews', {
    params: {
      productId,
      productSKU: productSku,
      isWithPhotos: true, // with photos only
      // isWithVideos: true, // with videos only
      minRating: 4,
      take: itemsPerPage,
      page,
      sortReviews: 'photos',
      storeUrl: stampedStoreUrl,
      apiKey: stampedApiKey,
    },
  });
};
export const getSingleReview = ({ reviewId }) =>
  stampedInstance.get('widget/reviews', {
    params: {
      reviewId,
      minRating: 1,
      apiKey: stampedApiKey,
      storeUrl: stampedStoreUrl,
      type: 'single',
    },
  });

export const createReview = ({
  productId,
  author,
  email,
  reviewRating,
  reviewTitle,
  reviewMessage,
  productName,
  productSku,
  productImageUrl,
  productUrl,
  images,
}) => {
  const form = new FormData();
  form.append('productId', productId);
  form.append('author', author);
  form.append('email', email);
  form.append('location', '');
  form.append('reviewRating', reviewRating);
  form.append('reviewTitle', reviewTitle);
  form.append('reviewMessage', reviewMessage);
  form.append('productName', productName);
  form.append('productSKU', productSku);
  form.append('productDescription', '');
  form.append('productImageUrl', productImageUrl);
  form.append('productUrl', productUrl);
  form.append('reviewSource', 'api');
  // form.append('reviewRecommendProduct', false);
  // TODO: fix images and videos
  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      form.append(`image${i}`, images[i]);
    }
  }
  return stampedInstance.post(`reviews3?apiKey=${stampedApiKey}&storeUrl=${stampedStoreUrl}`, form);
};

export const createQuestion = ({
  productId,
  name,
  email,
  reviewBody,
  productName,
  productSku,
  productUrl,
  productImageUrl,
}) => {
  return stampedInstance.post('questions', {
    productId,
    shop: stampedStoreUrl,
    apiKey: stampedApiKey,
    storeUrl: stampedShopUrl,
    sId: stampedStoreHash,
    name,
    email,
    reviewBody,
    productName,
    productDescription: '',
    productSku,
    productUrl,
    productImageUrl,
  });
};

/** Review Pages by StampedApp */
export const getProductReviews = ({ productId, productSku, page = 1, take = 10, minRating = 1, sortReviews }) => {
  return stampedInstance.get('widget/reviews', {
    params: {
      productId,
      productSku,
      page,
      take,
      minRating,
      sortReviews,
      apiKey: stampedApiKey,
      storeUrl: stampedShopUrl,
    },
  });
};

/** Review Pages by Ya-Ya */
// export const getProductReviews = ({
//   productId,
//   page = 1,
//   take = 10,
//   search = '',
//   filter,
//   filter2,
//   isVideo,
//   isFeatured,
// }) => {
//   return yayaInstance.get('review', {
//     params: {
//       productId,
//       page,
//       take,
//       search, // keyword
//       filter, // rating: high or low
//       filter2, // isPhotos: with or without
//       isVideo, // isVideos: true or false
//       isFeatured, // isFeatured: true or false
//     },
//   });
// };

export const getReviewCarouselPhotos = ({ productId, productSKU, page = 1, skip = 9999, minRating = 1 }) => {
  return stampedInstance.get('widget/reviews', {
    params: {
      type: 'widget-carousel-photos',
      // reviewId,
      productId,
      productSKU,
      // productTitle,
      random: false,
      isFillEmpty: false,
      page,
      skip,
      minRating,
      isWithPhotos: true,
      apiKey: stampedApiKey,
      storeUrl: stampedStoreHash,
    },
  });
};

export const getProductQuestions = ({ productId, page = 1, search = '' }) => {
  return yayaInstance.get('question', {
    params: {
      productId,
      page,
      search,
    },
  });
};

export const voteReview = ({ productId, reviewId }) => {
  return stampedInstance.post('reviews/vote', {
    productId,
    reviewId,
    vote: 1,
    storeUrl: stampedStoreHash,
    apiKey: stampedApiKey,
  });
};

export const voteQuestion = ({ productId, questionId }) => {
  return stampedInstance.post('questions/vote', {
    productId,
    questionId,
    vote: 1,
    storeUrl: stampedStoreHash,
    apiKey: stampedApiKey,
  });
};
