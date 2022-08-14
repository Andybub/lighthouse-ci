import './PartGallery.scss';
import PropTypes from 'prop-types';
import { memo } from 'react';
import GalleryItem from './GalleryItem';

const PartGallery = ({ gallery, toggleModalMore }) => {
  const part = gallery.data.slice(0, 8);

  return (
    <div className="part-gallery-container col-12 col-md-7">
      <div className="row justify-content-between">
        <p className="m-0">Customer Photos</p>
        <button
          type="button"
          className="btn-view-all prevent-children"
          data-toggle="modal"
          data-target="#gallery-modal"
        >
          View All <i className="fkt-long-arrow-right" />
        </button>
      </div>
      <div className="row">
        {part.map((item) => {
          return <GalleryItem key={item.id} data={item} toggleModalMore={toggleModalMore} customClassName="col-3" />;
        })}
      </div>
    </div>
  );
};

export default memo(PartGallery);

PartGallery.propTypes = {
  gallery: PropTypes.object.isRequired,
  toggleModalMore: PropTypes.func.isRequired,
};

PartGallery.defaultProps = {};
