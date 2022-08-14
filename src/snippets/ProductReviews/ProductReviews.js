import './ProductReviews.scss';
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Toggle from './components/Toggle';
import ReviewsContainer from './containers/ReviewsContainer';
import QuestionsContainer from './containers/QuestionsContainer';
import GalleryContainer from './containers/GalleryContainer';

const ProductReviews = () => {
  const { badge, questionsList } = useSelector((state) => state.data);
  const [isReviews, setIsReviews] = useState(true);

  const toggleReviews = useCallback(
    (value) => {
      setIsReviews(value);
    },
    [setIsReviews],
  );

  return (
    <div className="">
      {badge && (
        <Toggle
          reviewsCount={badge.count}
          questionsCount={questionsList && questionsList.total ? questionsList.total : 0}
          callback={toggleReviews}
          isReviews={isReviews}
        />
      )}
      <ReviewsContainer display={isReviews} />
      <QuestionsContainer display={!isReviews} />
      <GalleryContainer />
    </div>
  );
};

ProductReviews.propTypes = {};

ProductReviews.defaultProps = {};

export default ProductReviews;
