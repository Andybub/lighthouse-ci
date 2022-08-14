// https://cdn.stamped.io/uploads/photos/67527_8550695954_66f6130a_ef08_43e5_8e26_0c8eddb5b798.jpg
// https://cdn.stamped.io/tr:w-180,h-180/uploads/photos/67527_8550695954_66f6130a_ef08_43e5_8e26_0c8eddb5b798.jpg
// https://cdn.stamped.io/tr:w-180,h-180/uploads/videos/a83d39de7e8519bc09ac3573945317d7.jpg
import { isValidEmail } from './Validator';

const assetsBaseURL = 'https://cdn.stamped.io/';

export const getPhotoURL = ({ photo, type, width, height }) => {
  if (!photo) {
    return '';
  }
  let trimProps = '';
  if (width || height) {
    trimProps = `tr:${width ? `w-${width},` : ''}${height ? `h-${height}` : ''}`;
  }
  return `${assetsBaseURL}${trimProps}/uploads/${type}/${photo}${type === 'videos' ? '.jpg' : ''}`;
};

export const checkReviewForm = ({ author, email, reviewRating, reviewTitle, reviewMessage }) => {
  if (!author || !email || !reviewRating || !reviewTitle || !reviewMessage) {
    return false;
  }
  if (author.length < 1) {
    return false;
  }
  if (!isValidEmail(email)) {
    return false;
  }
  const rating = parseInt(reviewRating, 10);
  if (rating < 1 || rating > 5) {
    return false;
  }
  if (reviewTitle.length < 1) {
    return false;
  }
  if (reviewMessage.length < 1) {
    return false;
  }
  return true;
};

export const checkQuestionForm = ({ name, email, reviewBody }) => {
  if (!name || !email || !reviewBody) {
    return false;
  }
  if (name.length < 1) {
    return false;
  }
  if (!isValidEmail(email)) {
    return false;
  }
  if (reviewBody.length < 1) {
    return false;
  }
  return true;
};

export const formatReview = (review, renderSize = 500) => {
  let reviewUserPhotos = review?.reviewUserPhotos?.length ? review?.reviewUserPhotos?.split(',') : [];
  reviewUserPhotos = reviewUserPhotos.map((photo) =>
    getPhotoURL({ photo, type: 'photos', width: renderSize, height: renderSize }),
  );

  const reviewUserVideos = review?.reviewUserVideos?.length ? review?.reviewUserVideos?.split(',') : [];

  const mediaItems = [];
  reviewUserVideos.forEach((src) => {
    mediaItems.push({ type: 'video', src });
  });
  reviewUserPhotos.forEach((src) => {
    mediaItems.push({ type: 'photo', src });
  });

  return {
    ...review,
    mediaItems,
  };
};

export const starHtml = (rating) => {
  let html = '';
  const ratingInt = Math.floor(rating);
  const ratingFloat = rating - ratingInt;
  for (let i = 0; i < ratingInt; i++) {
    // full star
    html += `<i class="icomoon-star-full" aria-hidden="true"></i>`;
  }
  if (ratingFloat > 0) {
    // half star
    html += `<i class="icomoon-star-half-full" aria-hidden="true"></i>`;
  }
  for (let i = ratingFloat > 0 ? ratingInt + 1 : ratingInt; i < 5; i++) {
    // empty star
    html += `<i class="icomoon-star-empty" aria-hidden="true"></i>`;
  }
  return html;
};
