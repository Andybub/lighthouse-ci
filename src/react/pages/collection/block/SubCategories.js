import './SubCategories.scss';
import { memo } from 'react';
import PropTypes from 'prop-types';
// import RenderTip from '@/react/utils/RenderTip';

const SubCategory = (props) => {
  const { category } = props;
  const imgURL = new URL(category.image, 'https://www.efavormart.com');
  imgURL.searchParams.append('width', 200);

  // TODO collection image missing issue

  return (
    <a className="grid-category-item col-6 col-md-3 col-lg-2 mb-4 gtm-click-collection" href={category.url}>
      {/* <RenderTip /> */}
      <div className="category-item-container">
        <div className="img-container">
          <img className="lazyload" data-src={imgURL.href} data-id={category.id} alt={category.title} />
        </div>
        <h2>{category.title}</h2>
      </div>
    </a>
  );
};

SubCategory.propTypes = {
  category: PropTypes.object.isRequired,
};

const SubCategories = (props) => {
  const { relatedSubCategories } = props;
  // console.log(relatedSubCategories);
  return (
    <div className="block-sub-collection">
      {/* <RenderTip /> */}
      <div className={`categories-container row justify-content-center item-count-${relatedSubCategories.length}`}>
        {relatedSubCategories.map((category) => {
          return <SubCategory key={category.id} category={category} />;
        })}
      </div>
    </div>
  );
};

SubCategories.propTypes = {
  relatedSubCategories: PropTypes.array.isRequired,
};

export default memo(SubCategories);
