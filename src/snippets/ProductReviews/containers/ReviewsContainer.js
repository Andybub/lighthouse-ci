import './ReviewsContainer.scss';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkReviewForm } from '@/utils/Stamped';
import { getHeaderHeight } from '@/react/utils/public';
import { makeReview, fetchSingleReview, fetchReviewsList, makeVoteReview, toggleModalDetail } from '../actions';
import Badge from '../components/Badge';
import PartGallery from '../components/PartGallery';
import ReviewForm from '../components/ReviewForm';
import ReviewCreated from '../components/ReviewCreated';
import ReviewSearch from '../components/ReviewSearch';
import ReviewList from '../components/ReviewList';
import Pagination from '../components/Pagination';
import ReviewModalDetail from '../components/ReviewModalDetail';

const ReviewsContainer = ({ display }) => {
  const dispatch = useDispatch();
  const { badge, gallery, reviewsList, reviewListParams, reviewCreated, makeReviewLoading } = useSelector(
    (state) => state.data,
  );
  const { modalDetail } = useSelector((state) => state.common);
  const [displayForm, setDisplayForm] = useState(false);

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const reviewId = params.get('stamped_r_id');
    if (reviewId) {
      dispatch(fetchSingleReview(reviewId));
    }
  }, []);

  const clickWriteReviewHandler = useCallback(() => {
    // console.log('clickWriteReviewHandler');
    setDisplayForm(true);
  }, [setDisplayForm]);

  const submitHandler = useCallback((form) => {
    // console.log('submitHandler');
    if (checkReviewForm(form)) {
      dispatch(makeReview(form));
    }
  }, []);

  /**
   * Review List Data
   */
  const { data: reviews = [], total } = reviewsList || {};
  const { page, take, sortReviews } = reviewListParams || {};
  const changePage = (pageEmit) => {
    dispatch(fetchReviewsList({ page: pageEmit, sortReviews }));
    const anchor = document.getElementById('reviewListAnchor');
    anchor.scrollIntoView({
      behavior: 'smooth',
    });
  };

  /**
   * Search Func
   */
  const atSearch = (params) => {
    dispatch(fetchReviewsList(params));
  };

  /**
   * Modal Toggle
   */
  const toggleModalMore = useCallback((payload) => {
    console.log('toggleModalMore', payload);
    dispatch(toggleModalDetail(payload));
  }, []);

  /**
   * Voting Func
   */
  const atVote = async (reviewId) => {
    await dispatch(makeVoteReview({ reviewId }));
    const newReviewList = await dispatch(fetchReviewsList(reviewListParams));
    const [newReview] = newReviewList.data.filter((item) => item.id === modalDetail.data.id);

    /** update modal detail data */
    const modalDetailClone = JSON.parse(JSON.stringify(modalDetail));
    modalDetailClone.data.reviewVotesUp = newReview.reviewVotesUp;

    toggleModalMore(modalDetailClone);
  };

  return (
    <div className="reviews-container container" data-display={display}>
      <div className="form-container row justify-content-between">
        {badge && badge.rating && <Badge rating={badge.rating} count={badge.count} breakdown={badge.breakdown} />}
        {gallery && gallery.data.length > 0 && <PartGallery gallery={gallery} toggleModalMore={toggleModalMore} />}
        {!reviewCreated && (
          <div className="col-12 text-center p-0">
            <button
              type="button"
              className="btn-write-review rounded-pill prevent-children"
              onClick={clickWriteReviewHandler}
              data-display={!displayForm}
            >
              <i className="icomoon-write" />
              Write a Review
            </button>
            <ReviewForm display={displayForm} submitHandler={submitHandler} makeReviewLoading={makeReviewLoading} />
          </div>
        )}
        {reviewCreated && <ReviewCreated />}
      </div>
      <div className="position-relative">
        <div id="reviewListAnchor" style={{ position: 'absolute', top: `-${getHeaderHeight()}px` }} />
      </div>
      <ReviewSearch topics={reviewsList?.topics || []} atSearch={atSearch} />
      {!!reviews?.length && (
        <>
          <ReviewList reviews={reviews} atVote={atVote} toggleModalMore={toggleModalMore} />
          <Pagination currentPage={page} itemsPerPage={take} totalData={total} changePage={changePage} />
        </>
      )}
      <ReviewModalDetail modal={modalDetail} atVote={atVote} toggleModalMore={toggleModalMore} />
    </div>
  );
};

export default ReviewsContainer;

ReviewsContainer.propTypes = {
  display: PropTypes.bool.isRequired,
};

ReviewsContainer.defaultProps = {};
