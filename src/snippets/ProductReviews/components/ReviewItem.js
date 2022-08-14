import './ReviewItem.scss';
import PropTypes from 'prop-types';
import { memo, useRef, useEffect, useState } from 'react';
import { formatReview } from '@/utils/Stamped';
import RatingStarsRender from './RatingStarsRender';
import VoteBtn from './VoteBtn';
import ReviewVideo from './ReviewVideo';

const ReviewItem = (props) => {
  const { review: reviewRaw, atVote, toggleModalMore } = props;

  const review = formatReview(reviewRaw);

  const created = new Date(review.reviewDate);

  const [textClampedStatus, setTextClampedStatus] = useState(false);

  const refMessage = useRef();

  useEffect(() => {
    const isTextClamped = () => refMessage.current.scrollHeight > refMessage.current.clientHeight;

    setTextClampedStatus(isTextClamped());

    return () => {};
  }, []);

  return (
    <div className="review-item py-5">
      <div className="review-item-top pb-4 d-flex align-items-center">
        <RatingStarsRender rating={review.reviewRating} />
        <div className="review-item-title flex-fill text-break">{review.reviewTitle}</div>
      </div>

      <div className="review-item-content pb-4 d-flex" data-media-items={review.mediaItems.length}>
        <div className="review-item-media">
          {review.mediaItems.map((media, idx) => {
            return (
              <div key={Math.random()} className="review-item-media-content">
                {media.type === 'video' && (
                  <ReviewVideo
                    type="thumbnail"
                    src={media.src}
                    toggleModalMore={() => toggleModalMore({ status: true, data: review, activeIndex: idx })}
                  />
                )}
                {media.type === 'photo' && (
                  <img
                    src={media.src}
                    alt=""
                    onClick={() => toggleModalMore({ status: true, data: review, activeIndex: idx })}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div
          className="review-item-message line-clamp flex-fill text-break"
          ref={refMessage}
          data-clamped={textClampedStatus}
        >
          {review.reviewMessage}
          <button
            type="button"
            className="review-item-message-more"
            onClick={() => toggleModalMore({ status: true, data: review, activeIndex: 0 })}
          >
            <span>... More &gt;</span>
          </button>
        </div>
      </div>

      <div className="review-item-bottom d-flex justify-content-between align-items-center">
        <div className="review-item-detail">
          <div className="review-item-author d-flex align-items-center">
            <div className="review-item-author-name">{review.author}</div>
            {review.reviewVerifiedType === 2 && (
              <div className="review-item-author-type ml-3 d-flex align-items-center">
                <i className="icomoon-verify mr-2" />
                <span>Verified Buyer</span>
              </div>
            )}
          </div>
          <div className="review-item-date pt-3">{created.toLocaleDateString('en-US')}</div>
        </div>
        <VoteBtn voteCount={review.reviewVotesUp} atVote={() => atVote(review.id)} />
      </div>
    </div>
  );
};

ReviewItem.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.number.isRequired,
    reviewDate: PropTypes.string.isRequired,
    reviewRating: PropTypes.number.isRequired,
    reviewTitle: PropTypes.string.isRequired,
    reviewMessage: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    reviewVerifiedType: PropTypes.number.isRequired,
    reviewVotesUp: PropTypes.number.isRequired,
  }).isRequired,
  atVote: PropTypes.func.isRequired,
  toggleModalMore: PropTypes.func.isRequired,
};

export default memo(ReviewItem);
