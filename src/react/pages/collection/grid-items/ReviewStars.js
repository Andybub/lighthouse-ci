import './ReviewStars.scss';
import PropTypes from 'prop-types';

const ReviewStars = (props) => {
  const { id, href, count, review, average } = props;
  let html = '';
  const rating = average || review / 20;
  const ratingInt = Math.floor(rating);
  const ratingFloat = rating - ratingInt;
  for (let i = 0; i < ratingInt; i++) {
    // full star
    html += `<i class="spr-icon spr-icon-star" aria-hidden="true"></i>`;
  }
  if (ratingFloat > 0) {
    // half star
    html += `<i class="spr-icon spr-icon-star-half-alt" aria-hidden="true"></i>`;
  }
  for (let i = ratingFloat > 0 ? ratingInt + 1 : ratingInt; i < 5; i++) {
    // empty star
    html += `<i class="spr-icon spr-icon-star-empty" aria-hidden="true"></i>`;
  }

  const ratingDisplay = rating.toFixed(1);

  return (
    <a className="stamped-reviews-container prevent-children" href={href} data-product-id={id}>
      <div className="stamped-product-reviews-badge" data-id={id}>
        <div
          className="stamped-badge d-flex align-items-center"
          data-rating={ratingDisplay}
          data-lang=""
          aria-label={`Rated ${ratingDisplay} out of 5 stars`}
        >
          <div
            className="stamped-starrating stamped-badge-starrating"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <span
            className="stamped-badge-caption"
            data-reviews={count}
            data-rating={ratingDisplay}
            data-label="reviews"
            aria-label={`${count} reviews`}
          >
            ({count})
          </span>
        </div>
      </div>
    </a>
  );
};

ReviewStars.propTypes = {
  id: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  review: PropTypes.number,
  average: PropTypes.number,
};

ReviewStars.defaultProps = {
  review: 0,
  average: 0,
};

export default ReviewStars;
