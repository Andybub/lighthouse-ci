import { useState, useMemo, useCallback, memo } from 'react';
import PropTypes from 'prop-types';

import { useProductContext } from '@/react/contexts/STLProduct';

const VariantStyleComponent = ({ tagPrefix }) => {
  const { productId, setProductId, productData, variantStyleData } = useProductContext();

  const [hoverName, setHoverName] = useState('');

  const getStyleName = useCallback((product) => {
    const styleTag = product.data.tags.find((tag) => tag.includes(tagPrefix));
    if (styleTag) return styleTag.slice(tagPrefix.length);
    return '';
  }, []);

  const displayName = useMemo(() => {
    if (!getStyleName) return '';
    return hoverName || getStyleName(productData);
  }, [hoverName, getStyleName, productData]);

  return (
    <div className="variant-container variant-style-container">
      {!!variantStyleData && !!variantStyleData.length && (
        <>
          <p className="title">
            <span>Style : </span>
            <span>{displayName}</span>
          </p>
          <ul>
            {variantStyleData.map((product) => {
              const { id } = product.data;
              const styleName = getStyleName(product);
              return (
                <li
                  key={id}
                  data-product-id={id}
                  className={id === productId ? 'active' : ''}
                  onClick={() => setProductId(id)}
                  onMouseOver={() => setHoverName(styleName)}
                  onMouseOut={() => setHoverName('')}
                >
                  {styleName}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

VariantStyleComponent.propTypes = {
  tagPrefix: PropTypes.string.isRequired,
};

export default memo(VariantStyleComponent);
