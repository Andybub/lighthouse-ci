import './GalleryContainer.scss';
// import PropTypes from 'prop-types';
import { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGallery, toggleModalDetail } from '../actions';
import GalleryItem from '../components/GalleryItem';

const itemsPerPage = 30;

const GalleryContainer = () => {
  const dispatch = useDispatch();
  const { gallery } = useSelector((state) => state.data);
  const [currentPage, setCurrentPage] = useState(gallery.page);
  const totalPage = Math.ceil(gallery.total / itemsPerPage);

  useEffect(() => {
    if (gallery.loading === false) {
      console.log('gallery.loading', gallery.loading);
      const index = (gallery.page - 1) * itemsPerPage;
      console.log('index', index);
      const firstItem = document.querySelectorAll('#gallery-modal .gallery-item')[index];
      console.log('firstItem', firstItem);
      if (firstItem) {
        firstItem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [gallery]);

  const loadMoreHandler = useCallback(() => {
    console.log('loadMoreHandler');
    setCurrentPage((prev) => {
      dispatch(fetchGallery({ page: prev + 1, itemsPerPage }));
      return prev + 1;
    });
  }, [setCurrentPage]);

  const toggleModalMore = useCallback((payload) => {
    dispatch(toggleModalDetail(payload));
  }, []);

  return (
    <div id="gallery-modal" className="gallery-container modal fade" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable container">
        <div className="modal-content container">
          <div className="modal-header row justify-content-between align-items-center border-bottom-0">
            <h2 className="modal-title">Customer Photos ({gallery.total})</h2>
            {/* <p className="modal-sub-title" /> */}
            <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body row">
            {gallery &&
              gallery.data.length > 0 &&
              gallery.data.map((item) => {
                return (
                  <GalleryItem
                    key={item.id}
                    data={item}
                    toggleModalMore={toggleModalMore}
                    customClassName="col-4 col-sm-3 col-md-2 col-lg-2"
                  />
                );
              })}
          </div>
          <div className="modal-footer border-top-0">
            {gallery.page < totalPage && (
              <button
                type="button"
                className="btn btn-load-more prevent-children mx-auto d-block rounded-pill"
                onClick={loadMoreHandler}
                data-current-page={currentPage}
                disabled={gallery.loading}
              >
                {gallery.loading ? 'Loading' : 'Load More'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryContainer;

GalleryContainer.propTypes = {};

GalleryContainer.defaultProps = {};
