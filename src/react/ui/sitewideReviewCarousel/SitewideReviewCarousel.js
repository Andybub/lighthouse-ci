import './SitewideReviewCarousel.scss';
import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const ReviewStars = (props) => {
  const { rating } = props;
  let html = '';
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
    <div className="stamped-reviews-container prevent-children">
      <div className="stamped-product-reviews-badge">
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
          <span className="stamped-badge-caption">{ratingDisplay}</span>
        </div>
      </div>
    </div>
  );
};

ReviewStars.propTypes = {
  rating: PropTypes.number,
};

const ReviewItem = (props) => {
  const {
    productId,
    productImageThumbnailUrl,
    productName,
    productUrl,
    reviewDate,
    reviewMessage,
    reviewRating,
    reviewTitle,
    reviewVerifiedType,
  } = props;

  return (
    <div className="swiper-slide">
      <a className="" href={productUrl}>
        <div className="top-container d-flex align-items-start">
          <img className="lazyload" data-src={productImageThumbnailUrl} alt={productName} />
          <div className="info">
            <p className="review-title">{reviewTitle}</p>
            <ReviewStars rating={reviewRating} />
            <p className="review-message">{reviewMessage}</p>
          </div>
        </div>
        <div className="bottom-container d-flex justify-content-between align-items-start">
          <p className="review-verified-type">
            <i className="icomoon-verify" />
            Verified Buyer
          </p>
          <p className="review-date">{reviewDate}</p>
        </div>
      </a>
    </div>
  );
};

ReviewItem.propTypes = {
  productId: PropTypes.number.isRequired,
  productImageThumbnailUrl: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  productUrl: PropTypes.string.isRequired,
  reviewDate: PropTypes.string.isRequired,
  reviewMessage: PropTypes.string.isRequired,
  reviewRating: PropTypes.number.isRequired,
  reviewTitle: PropTypes.string.isRequired,
  reviewVerifiedType: PropTypes.number.isRequired,
};

const SitewideReviewCarousel = (props) => {
  const { items, totalReviews } = props;

  const refDOM = useRef();

  useEffect(() => {
    const checkId = setInterval(() => {
      const { Swiper } = window;
      if (Swiper) {
        clearInterval(checkId);
        const mySwiper = new Swiper(refDOM.current, {
          spaceBetween: 15,
          slidesOffsetBefore: 15,
          slidesOffsetAfter: 15,
          slidesPerView: 1.2,
          loop: true,
          // autoplay: { delay: 7000 },
          preloadImages: false,
          centeredSlides: false,
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
            prevEl: '.swiper-prev',
            nextEl: '.swiper-next',
            disabledClass: 'is-disabled',
          },
          breakpoints: {
            414: {
              slidesPerView: 1.4,
            },
            768: {
              slidesPerView: 2.6,
            },
            992: {
              slidesPerView: 3.05,
            },
          },
        });
      }
    }, 1000);
  }, []);

  return (
    <div className="sitewide-review-carousel position-relative">
      <div className="title-container d-flex justify-content-between align-items-center">
        <h3 className="title">Reviews from Real Customers</h3>
        <div className="count-container d-flex justify-content-between align-items-center">
          <span>({totalReviews.toLocaleString('en-US')} Reviews)</span>
          <a className="btn-view-more" href="/pages/all-customer-reviews">
            View More <i className="fkt-long-arrow-right" />
          </a>
        </div>
      </div>
      <div className="swiper swiper-container" ref={refDOM}>
        <div className="swiper-wrapper">
          {items.map((item) => (
            <ReviewItem key={item.id} {...item} />
          ))}
        </div>
      </div>
      {/* <div className="swiper-pagination w-100" /> */}
      <button type="button" className="swiper-prev d-none d-lg-flex">
        <span className="icomoon-arrow-4" />
      </button>
      <button type="button" className="swiper-next d-none d-lg-flex">
        <span className="icomoon-arrow-4" />
      </button>
    </div>
  );
};

SitewideReviewCarousel.propTypes = {
  items: PropTypes.array.isRequired,
  totalReviews: PropTypes.number.isRequired,
};

export default SitewideReviewCarousel;
