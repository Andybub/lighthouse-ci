import './Badge.scss';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { starHtml } from '@/utils/Stamped';

const Badge = ({ rating, count, breakdown }) => {
  return (
    <div className="badge-container col-12 col-md-5 d-flex flex-column align-items-center">
      <p className="text-center d-flex align-items-center">
        <span className="rating">{rating.toFixed(1)}</span>
        <span
          className="stamped-starrating stamped-badge-starrating"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: starHtml(rating) }}
        />
      </p>
      <p className="base mb-2">Based on {count.toLocaleString('en-US')} Reviews</p>
      {breakdown && (
        <ul>
          {[5, 4, 3, 2, 1].map((index) => {
            const subRating = parseInt(breakdown[`rating${index}`], 10);
            const percentage = parseInt((subRating / count) * 100, 10);
            return (
              <li key={index} className="d-flex align-items-center">
                <span className="head-rating">{index}</span>
                <span className="stamped-starrating stamped-badge-starrating" aria-hidden="true">
                  <i className="icomoon-star-full" aria-hidden="true" />
                </span>
                <div className="bar position-relative">
                  {subRating > 0 && <div className="process" style={{ width: `${percentage}%` }} />}
                </div>
                <span>{subRating}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default memo(Badge);

Badge.propTypes = {
  rating: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  breakdown: PropTypes.object.isRequired,
};

Badge.defaultProps = {};
