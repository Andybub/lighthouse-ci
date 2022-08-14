import './ReviewCreated.scss';
import { memo } from 'react';

const ReviewCreated = () => {
  // console.log('ReviewCreated');

  return (
    <div className="review-created-container container row">
      <p className="title col-12 text-center">Thank you for submitting a review!</p>
      <p className="body col-12 text-center">
        Your input is very much appreciated.
        <br /> Share it with your friends so they can enjoy it too!
      </p>
    </div>
  );
};

export default memo(ReviewCreated);

ReviewCreated.propTypes = {};

ReviewCreated.defaultProps = {};
