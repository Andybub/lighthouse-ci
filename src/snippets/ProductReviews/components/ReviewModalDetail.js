import { useRef, useCallback, useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import RatingStarsRender from './RatingStarsRender';
import VoteBtn from './VoteBtn';
import ReviewVideo from './ReviewVideo';
import './ReviewModalDetail.scss';

const AllReviewsSwiper = (props) => {
  const { slides, activeIndex, setActiveIndex } = props;
  const refSwiper = useRef();
  const refDOM = useRef();

  const initSwiper = useCallback(() => {
    const { Swiper } = window;
    refSwiper.current = new Swiper(refDOM.current, {
      // spaceBetween: 10,
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      slidesPerGroupAuto: true,
      watchSlidesProgress: true,
      // loop: true,
      preloadImages: false,
      centerInsufficientSlides: true,
      watchOverflow: true,
      freeMode: {
        enabled: true,
        sticky: true,
      },
      lazy: {
        enabled: true,
        checkInView: true,
        loadOnTransitionStart: true,
      },
      navigation: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next',
        disabledClass: 'is-disabled',
      },
    });
  }, []);

  useEffect(() => {
    if (slides?.length) {
      initSwiper();
    }
    return () => {
      refSwiper.current?.destroy();
    };
  }, [slides]);

  const atClick = (idx) => {
    setActiveIndex(idx);
  };

  return (
    <div className="all-reviews-swiper swiper swiper-container" ref={refDOM}>
      <div className="swiper-wrapper">
        {slides.map((slide, idx) => {
          return (
            <div
              key={Math.random()}
              className="swiper-slide"
              data-active={idx === activeIndex}
              onClick={() => atClick(idx)}
            >
              <div className="all-reviews-item">
                {slide.type === 'video' ? (
                  <ReviewVideo type="thumbnail" src={slide.src} />
                ) : (
                  <div
                    className="all-reviews-item-img"
                    style={{
                      backgroundImage: `url(${slide.src})`,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="swiper-buttons position-absolute">
        <div className="content-buttons position-relative">
          <div className="swiper-button-prev fkt-2x rounded-circle" />
          <div className="swiper-button-next fkt-2x rounded-circle" />
        </div>
      </div>
    </div>
  );
};

AllReviewsSwiper.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.any).isRequired,
  activeIndex: PropTypes.number.isRequired,
  setActiveIndex: PropTypes.func.isRequired,
};

const ReviewModalDetail = (props) => {
  const { modal, atVote, toggleModalMore } = props;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(modal.activeIndex || 0);

    return () => {};
  }, [modal.activeIndex]);

  let mediaMainRender = modal?.data?.mediaItems?.[activeIndex];

  if (!mediaMainRender) {
    mediaMainRender = { type: 'photo', src: modal?.data?.productImageLargeUrl };
  }

  return (
    <div
      className="review-modal-detail review-modal-container"
      data-active={modal.status}
      onClick={() => toggleModalMore({ status: false })}
    >
      <div
        className="review-modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button type="button" className="review-modal-close" onClick={() => toggleModalMore({ status: false })}>
          <i className="icomoon-close" />
        </button>
        <div className="review-modal-content">
          <div className="review-detail">
            <div className="review-media-wrapper">
              {mediaMainRender?.type === 'video' ? (
                <ReviewVideo type="video" src={mediaMainRender?.src} />
              ) : (
                <div
                  className="review-img"
                  style={{
                    backgroundImage: `url(${mediaMainRender?.src})`,
                  }}
                />
              )}
            </div>
            <div className="review-info">
              <div className="review-info-top">
                <RatingStarsRender rating={modal?.data?.reviewRating || 0} />
                <div className="review-title text-break">{modal?.data?.reviewTitle || ''}</div>
              </div>
              <div className="review-info-middle">
                <div className="review-message text-break">{modal?.data?.reviewMessage}</div>
              </div>
              <div className="review-info-bottom">
                <div className="review-info-left">
                  <div className="review-author">
                    <div className="review-author-name">{modal?.data?.author}</div>
                    {modal?.data?.reviewVerifiedType === 2 && (
                      <div className="review-author-type">
                        <i className="icomoon-verify mr-2" />
                        <span>Verified Buyer</span>
                      </div>
                    )}
                  </div>
                  <div className="review-date">{modal?.data?.reviewDate}</div>
                </div>
                <div className="review-info-right">
                  <div className="review-voting">
                    <VoteBtn voteCount={modal?.data?.reviewVotesUp || 0} atVote={() => atVote(modal.data.id)} />
                  </div>
                </div>
              </div>
              <div className="review-info-purchased">
                <div className="review-info-purchased-title">Purchased item:</div>
                <a href={modal?.data?.productUrl} className="review-info-purchased-item">
                  <div
                    className="review-info-purchased-item-img"
                    style={{
                      backgroundImage: `url(${modal?.data?.productImageUrl})`,
                    }}
                  />
                  <div className="review-info-purchased-item-name">{modal?.data?.productName}</div>
                </a>
              </div>
            </div>
          </div>
          <div className="review-list">
            {!!modal?.data?.mediaItems?.length && (
              <AllReviewsSwiper
                slides={modal.data.mediaItems}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ReviewModalDetail.propTypes = {
  modal: PropTypes.shape({
    status: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      id: PropTypes.number,
      reviewRating: PropTypes.number,
      reviewTitle: PropTypes.string,
      reviewMessage: PropTypes.string,
      author: PropTypes.string,
      reviewVerifiedType: PropTypes.number,
      reviewDate: PropTypes.string,
      reviewVotesUp: PropTypes.number,
      productImageUrl: PropTypes.string,
      productImageLargeUrl: PropTypes.string,
      productName: PropTypes.string,
      productUrl: PropTypes.string,
      mediaItems: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string,
          src: PropTypes.string,
        }),
      ).isRequired,
    }),
    activeIndex: PropTypes.number,
  }).isRequired,
  atVote: PropTypes.func.isRequired,
  toggleModalMore: PropTypes.func.isRequired,
};

export default memo(ReviewModalDetail);
