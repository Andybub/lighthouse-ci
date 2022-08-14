import PropTypes from 'prop-types';
import { getPhotoURL } from '@/utils/Stamped';
import './ReviewVideo.scss';

// BLOCK: VideoContent
const VideoContent = (props) => {
  const { thumbnailSrc, videoSrc } = props;

  return (
    <video
      poster={thumbnailSrc}
      controls
      autoPlay
      muted
      preload="none"
      onClick={(e) => {
        e.stopPropagation();
        e.currentTarget.play();
      }}
    >
      <source src={videoSrc} type="video/mp4" />
      <track kind="captions" />
    </video>
  );
};

VideoContent.propTypes = {
  thumbnailSrc: PropTypes.string.isRequired,
  videoSrc: PropTypes.string.isRequired,
};

// BLOCK: VideoThumbnail
const VideoThumbnail = (props) => {
  const { thumbnailSrc, toggleModalMore } = props;

  const atClick = () => {
    if (!toggleModalMore) return;
    toggleModalMore();
  };

  return (
    <div className="review-video-thumbnail" onClick={atClick}>
      <img src={thumbnailSrc} alt="" />
      <img
        className="play-icon position-absolute"
        src={`${window.TW.assetPath}review-play.svg`}
        alt=""
        width="45"
        height="45"
      />
    </div>
  );
};

VideoThumbnail.propTypes = {
  thumbnailSrc: PropTypes.string.isRequired,
  toggleModalMore: PropTypes.func.isRequired,
};

// BLOCK: ReviewVideo
const ReviewVideo = (props) => {
  const { type = 'video', src, toggleModalMore } = props;
  const thumbnailSrc = getPhotoURL({ photo: src, type: 'videos', width: 500, height: 500 });
  const videoSrc = `//s3.us-west-2.amazonaws.com/stamped.io/uploads/videos/${src}.mp4#t=0.1`;

  return (
    <div className="review-video">
      {type === 'thumbnail' ? (
        <VideoThumbnail thumbnailSrc={thumbnailSrc} toggleModalMore={toggleModalMore} />
      ) : (
        <VideoContent thumbnailSrc={thumbnailSrc} videoSrc={videoSrc} />
      )}
    </div>
  );
};

ReviewVideo.propTypes = {
  type: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  toggleModalMore: PropTypes.func,
};

ReviewVideo.defaultProps = {
  toggleModalMore: () => {},
};

export default ReviewVideo;
