import './ReviewForm.scss';
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { VideoFirstFrame } from '@/utils/VideoFirstFrame';

const convertFile2Image = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (response) => {
      if (response.target.result) {
        resolve(response.target.result);
      } else {
        reject(new Error(`convertFile2Image failed: ${file.name}`));
      }
    };
  });
};

const ReviewForm = ({ display, submitHandler, makeReviewLoading }) => {
  const [files, setFiles] = useState([]);
  const count = files.filter((file) => Boolean(file.image)).length;
  const [stars, setStars] = useState('');

  const starHandler = useCallback(
    (e) => {
      setStars(e.target.dataset.stars);
    },
    [setStars],
  );

  const fileHandler = useCallback(
    (e) => {
      const file = e.target.files[0];
      const isVideo = file.type.includes('video');
      if (isVideo) {
        VideoFirstFrame.get(file)
          .then((frame) => {
            convertFile2Image(frame)
              .then((image) => {
                const data = { key: Date.now() * Math.random(), date: Date.now(), image, file };
                setFiles((prev) => {
                  const array = [...prev];
                  array.push(data);
                  return array;
                });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        convertFile2Image(file)
          .then((image) => {
            const data = { key: Date.now() * Math.random(), date: Date.now(), image, file };
            setFiles((prev) => {
              const array = [...prev];
              array.push(data);
              return array;
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    [setFiles],
  );

  const fileClearer = useCallback((e) => {
    e.target.value = null;
  }, []);

  const removeHandler = useCallback(
    (e) => {
      console.log(e.target.dataset.index);
      setFiles((prev) => {
        const array = [...prev];
        array.splice(e.target.dataset.index, 1);
        return array;
      });
    },
    [setFiles],
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const { author, email, reviewRating, reviewTitle, reviewMessage } = e.target;
      const form = {
        author: author.value.trim(),
        email: email.value.trim(),
        reviewRating: reviewRating.value,
        reviewTitle: reviewTitle.value.trim(),
        reviewMessage: reviewMessage.value.trim(),
        images: files.filter((file) => Boolean(file.file)).map((file) => file.file),
      };
      submitHandler(form);
    },
    [submitHandler, files],
  );

  return (
    <form className="review-form-container" data-display={display} data-loading={makeReviewLoading} onSubmit={onSubmit}>
      <div className="form-row">
        <div className="form-group col-12 col-md-6">
          <input type="text" className="form-control" name="author" placeholder="Enter your name" required />
        </div>
        <div className="form-group col-12 col-md-6">
          <input type="email" className="form-control" name="email" placeholder="john.smith@example.com" required />
        </div>
        <div className="review-selector col-12 d-flex align-items-center">
          <span>Write Review</span>
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              type="button"
              className="btn-review-selector prevent-children"
              key={i}
              onClick={starHandler}
              data-stars={i}
              data-active={stars >= i}
            >
              <i className="icomoon-star-full" aria-hidden="true" />
            </button>
          ))}
          <input className="m-0" type="text" name="reviewRating" defaultValue={stars} required />
        </div>
        <div className="form-group col-12">
          <input
            type="text"
            className="form-control"
            name="reviewTitle"
            placeholder="Give your review a title"
            required
          />
        </div>
        <div className="form-group col-12">
          <textarea
            className="form-control"
            name="reviewMessage"
            placeholder="How was your overall experience?"
            required
          />
        </div>
        <div className="form-group col-12 col-lg-8 d-flex">
          <div
            className="btn-review-file-upload flex-column justify-content-center align-items-center position-relative col-auto"
            data-display={count < 5}
          >
            <input
              type="file"
              className="form-control-file position-absolute"
              name="image"
              accept="image/*,video/*"
              onChange={fileHandler}
              onClick={fileClearer}
            />
            <i className="icomoon-file-img-video" />
            {count < 1 ? <span>upload</span> : <span>{`+ ${count}/5`}</span>}
          </div>
          {files.map((file, index) => (
            <div className="file-item position-relative col-auto" key={file.key} data-index={index}>
              <img className="position-absolute" src={file.image} alt="" />
              <button
                type="button"
                className="btn-review-file-remove prevent-children position-absolute"
                onClick={removeHandler}
                data-date={file.date}
                data-index={index}
              >
                <i className="icomoon-close" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="btn btn-submit rounded-pill col-12 col-lg-4 align-self-center"
          disabled={makeReviewLoading}
        >
          {makeReviewLoading ? 'Sending...' : 'Submit'}
        </button>
      </div>
      <div className="loading app-placeholder position-absolute" data-display={makeReviewLoading} />
    </form>
  );
};

export default ReviewForm;

ReviewForm.propTypes = {
  display: PropTypes.bool.isRequired,
  submitHandler: PropTypes.func.isRequired,
  makeReviewLoading: PropTypes.bool.isRequired,
};

ReviewForm.defaultProps = {};
