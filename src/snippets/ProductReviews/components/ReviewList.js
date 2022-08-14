import { memo } from 'react';
import PropTypes from 'prop-types';
import useWindowDimensions from '@/react/hooks/useWindowDimensions';
import ReviewItem from './ReviewItem';
import './ReviewList.scss';

const ReviewList = (props) => {
  const { reviews, atVote, toggleModalMore } = props;

  let columns = 1;
  const { width } = useWindowDimensions();
  switch (true) {
    case width < 768:
      columns = 1;
      break;
    case width >= 768 && width < 1200:
      columns = 2;
      break;
    case width >= 1200:
      columns = 3;
      break;
    default:
  }

  const columnsContainer = [...Array(columns)].map(() => []);

  reviews.reduce((acc, cur) => {
    const idx = reviews.findIndex((review) => review.id === cur.id);
    const remainder = idx % columns;
    acc[remainder].push(cur);
    return acc;
  }, columnsContainer);

  return (
    <div className="review-list d-flex justify-content-between">
      {columnsContainer.map((columnReviews, idx) => {
        return (
          <div key={Math.random()} className={`review-list-column media-body ${idx !== 0 && 'pl-4'}`}>
            {columnReviews.map((review) => {
              return <ReviewItem key={review.id} review={review} atVote={atVote} toggleModalMore={toggleModalMore} />;
            })}
          </div>
        );
      })}
    </div>
  );
};

ReviewList.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  atVote: PropTypes.func.isRequired,
  toggleModalMore: PropTypes.func.isRequired,
};

export default memo(ReviewList);
