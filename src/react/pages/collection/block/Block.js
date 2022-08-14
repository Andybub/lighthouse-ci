import PropTypes from 'prop-types';
import { memo } from 'react';
// import RenderTip from '@/react/utils/RenderTip';
import HeaderImage from './HeaderImage';
import BestSellers from './BestSellers';
import SubCategories from './SubCategories';

// TODO flex order
const Block = (props) => {
  const { metafields, relatedSubCategories, title } = props;
  // console.log('Block rerender!');
  // console.log('relatedSubCategories', relatedSubCategories);
  const hasContent =
    metafields.global.header_image_desktop ||
    metafields.global.header_image_mobile ||
    (relatedSubCategories && relatedSubCategories.length > 0) ||
    (metafields.bestseller && metafields.bestseller.slides);

  return (
    <div className={`block-container w-100 ${hasContent ? 'pt-4 pb-4' : 'd-none'}`}>
      {/* <RenderTip /> */}

      {(metafields.global.header_image_desktop || metafields.global.header_image_mobile) && (
        <HeaderImage desktop={metafields.global.header_image_desktop} mobile={metafields.global.header_image_mobile} />
      )}

      {relatedSubCategories && relatedSubCategories.length > 0 && (
        <SubCategories relatedSubCategories={relatedSubCategories} />
      )}

      {metafields.bestseller && metafields.bestseller.slides && (
        <BestSellers slides={metafields.bestseller.slides} title={title} />
      )}
    </div>
  );
};

Block.propTypes = {
  metafields: PropTypes.object,
  relatedSubCategories: PropTypes.array,
  title: PropTypes.string.isRequired,
};

Block.defaultProps = {
  metafields: {},
  relatedSubCategories: [],
};

export default memo(Block);
