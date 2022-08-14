import './GalleryItem.scss';
import PropTypes from 'prop-types';
import { memo, useCallback } from 'react';
import { getPhotoURL, formatReview } from '@/utils/Stamped';

const GalleryItem = ({ data, toggleModalMore, customClassName = 'col' }) => {
  let firstImage;
  let imgURL;

  if (data.reviewUserVideos) {
    [firstImage] = data.reviewUserVideos.split(',');
    imgURL = getPhotoURL({ photo: firstImage, type: 'videos', width: 180, height: 180 });
  } else if (data.reviewUserPhotos) {
    [firstImage] = data.reviewUserPhotos.split(',');
    imgURL = getPhotoURL({ photo: firstImage, type: 'photos', width: 180, height: 180 });
  }

  const clickHandler = useCallback(() => {
    // TODO open modal
    console.log('reviewId', data.id);
    // console.log('data', data);
    toggleModalMore({ status: true, data: formatReview(data), activeIndex: 0 });
  }, []);

  return (
    <button
      key={data.id}
      type="button"
      className={`gallery-item ${customClassName} prevent-children position-relative`}
      onClick={clickHandler}
    >
      <img className="photo" src={imgURL} alt="" width="90" height="90" />
      {data.reviewUserVideos && (
        <img
          className="play-icon position-absolute"
          src={`${window.TW.assetPath}review-play.svg`}
          alt=""
          width="45"
          height="45"
        />
      )}
    </button>
  );
};

export default memo(GalleryItem);

GalleryItem.propTypes = {
  data: PropTypes.shape({
    // author: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    // productId: PropTypes.number.isRequired,
    // productImageLargeUrl: PropTypes.string.isRequired,
    // productImageThumbnailUrl: PropTypes.string.isRequired,
    // productImageUrl: PropTypes.string.isRequired,
    // productName: PropTypes.string.isRequired,
    // productSKU: PropTypes.string.isRequired,
    // productUrl: PropTypes.string.isRequired,
    reviewUserVideos: PropTypes.string,
    reviewUserPhotos: PropTypes.string,
  }).isRequired,
  toggleModalMore: PropTypes.func.isRequired,
  customClassName: PropTypes.string,
};

GalleryItem.defaultProps = {
  customClassName: '',
};
