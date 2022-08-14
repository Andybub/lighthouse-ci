import './Description.scss';
import { memo } from 'react';
import PropTypes from 'prop-types';
// import RenderTip from '@/react/utils/RenderTip';

const Description = (props) => {
  const { description } = props;

  return (
    <div className="description-container container pb-5 position-relative row justify-content-end">
      {/* <RenderTip /> */}
      <div className="col-12 col-lg-9" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
};

Description.propTypes = {
  description: PropTypes.string.isRequired,
};

export default memo(Description);
