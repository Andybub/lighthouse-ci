import { useState, useMemo, useCallback, memo } from 'react';
import PropTypes from 'prop-types';

import { useProductContext } from '@/react/contexts/STLProduct';

const VariantColorComponent = ({ tagPrefix }) => {
  const { productId, setProductId, productData, variantColorData } = useProductContext();

  const [displayLimit, setDisplayLimit] = useState(15);
  const clickDisplayMore = () => {
    setDisplayLimit(variantColorData.length);
  };

  const [hoverName, setHoverName] = useState('');

  const getColorName = useCallback((product) => {
    if (product.color_override) return product.color_override;
    const colorTag = product.data.tags.find((tag) => tag.includes(tagPrefix));
    if (colorTag) return colorTag.slice(tagPrefix.length);
    return '';
  }, []);

  const displayName = useMemo(() => {
    if (!getColorName) return '';
    return hoverName || getColorName(productData);
  }, [hoverName, getColorName, productData]);

  return (
    <div className="variant-container variant-color-container">
      {!!variantColorData && !!variantColorData.length && (
        <>
          <p className="title">
            <span>Color : </span>
            <span>{displayName}</span>
          </p>
          <ul>
            {variantColorData
              .filter((product, index) => index < displayLimit)
              .map((product) => {
                const { id } = product.data;
                const colorName = getColorName(product);
                // reduce image size 66x66
                const featuredImage = product.whtbkgd_image
                  ? product.whtbkgd_image
                  : product.data.featured_image.replace('.jpg?v=', '_66x66.jpg?v=');
                return (
                  <li
                    key={id}
                    data-product-id={id}
                    className={id === productId ? 'active' : ''}
                    onClick={() => setProductId(id)}
                    onMouseOver={() => setHoverName(colorName)}
                    onMouseOut={() => setHoverName('')}
                  >
                    <img src={featuredImage} alt={colorName} />
                  </li>
                );
              })}
            <li className="empty" />
            <li className="empty" />
            <li className="empty" />
            <li className="empty" />
          </ul>
          {displayLimit < variantColorData.length && (
            <button type="button" className="btn-more" onClick={clickDisplayMore}>
              {' '}
              + More Options
            </button>
          )}
        </>
      )}
    </div>
  );
};

VariantColorComponent.propTypes = {
  tagPrefix: PropTypes.string.isRequired,
};

export default memo(VariantColorComponent);
