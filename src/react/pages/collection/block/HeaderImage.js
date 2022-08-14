import { memo } from 'react';
import PropTypes from 'prop-types';
// import RenderTip from '@/react/utils/RenderTip';

const HeaderImage = (props) => {
  const {desktop, mobile} = props;

  return (
    <div className="header-image-container w-100 position-relative">
      {/* <RenderTip /> */}
      {desktop &&
        <picture>
          {mobile && <source media="(max-width: 768px)" srcSet={mobile}/>}
          <img className="w-100" src={desktop} alt=""/>
        </picture>
      }
    </div>
  );
};

HeaderImage.propTypes = {
  desktop: PropTypes.string.isRequired,
  mobile: PropTypes.string.isRequired,
};

export default memo(HeaderImage);