import './Toggle.scss';
import PropTypes from 'prop-types';
import { memo, useCallback } from 'react';

const Toggle = ({ reviewsCount, questionsCount, callback, isReviews }) => {
  const toggleHandle = useCallback((e) => {
    const { label } = e.target.dataset;
    callback(label === 'reviews');
  }, []);

  return (
    <div className="toggle-container">
      <button
        type="button"
        onClick={toggleHandle}
        data-label="reviews"
        data-is-active={isReviews}
      >{`Reviews ${reviewsCount}`}</button>
      <button
        type="button"
        onClick={toggleHandle}
        data-label="questions"
        data-is-active={!isReviews}
      >{`Questions ${questionsCount}`}</button>
    </div>
  );
};

export default memo(Toggle);

Toggle.propTypes = {
  reviewsCount: PropTypes.number.isRequired,
  questionsCount: PropTypes.number.isRequired,
  callback: PropTypes.func.isRequired,
  isReviews: PropTypes.bool.isRequired,
};

Toggle.defaultProps = {};
