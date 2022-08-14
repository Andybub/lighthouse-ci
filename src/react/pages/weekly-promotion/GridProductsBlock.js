import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import GridItems from './grid-items';

const WINDOW_WIDTH_LG = 992

const GridProductsBlock = ({ gridType, gridCollection, gridItems }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mobileMode, setMobileMode] = useState(window.innerWidth < WINDOW_WIDTH_LG);

  const {
    alt_text: altText,
    block_title: blockTitle,
    button_label: buttonLabel,
    featured_image_desktop: featuredImageDesktop,
    featured_image_mobile: featuredImageMobile,
    linked_url: linkedUrl,
  } = gridCollection;

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    setMobileMode(windowWidth < WINDOW_WIDTH_LG);
  }, [windowWidth]);

  return (
    <div className="container grid-products-block w-100">
      <div className="row">
        {/* product banner START */}
        <div className="col-12 col-lg-3">
          <a className="grid-products-banner gtm-click-collection" href={linkedUrl}>
              <div className="grid-text-block position-absolute d-flex flex-column justify-content-center justify-content-lg-between align-items-center w-100 h-100">
                <div className="grid-products-title text-center text-uppercase">{blockTitle}</div>
                <button className="btn" type="button">
                  {buttonLabel}<i className="fkt-long-arrow-right" />
                </button>
              </div>
              <img className="d-none d-lg-block w-100 featured-image" src={featuredImageDesktop} alt={altText} />
              <img className="d-block d-lg-none w-100 featured-image" src={featuredImageMobile} alt={altText} />
          </a>
        </div>
        {/* product banner END */}
        {/* products swiper START */}
        <div className="col-12 col-lg-9">
          {gridItems && gridItems.length > 0 && <GridItems realPayload={gridItems} windowWidth={windowWidth} mobileMode={mobileMode} gridType={gridType} />}
        </div>
        {/* products swiper END */}
      </div>
      <div className="hr-line" />
    </div>
  )
};

GridProductsBlock.propTypes = {
  gridCollection: PropTypes.object.isRequired,
  gridItems: PropTypes.array,
};

GridProductsBlock.defaultProps = {
  gridItems: [],
};

export default GridProductsBlock;
