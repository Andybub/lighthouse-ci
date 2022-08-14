import PropTypes from 'prop-types';
import './RatingStarsRender.scss';

const RatingStars = (props) => {
  const { rating } = props;
  const isFloat = rating % 1 !== 0;

  return (
    <div className="rating-stars-render">
      {[...Array(Math.floor(rating))].map(() => {
        return <i key={Math.random()} className="rating-star icomoon-star-full" />;
      })}
      {isFloat && <i className="rating-star icomoon-star-half" />}
    </div>
  );
};

RatingStars.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default RatingStars;
