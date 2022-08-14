import { useState, useMemo, useCallback, memo } from 'react';
import PropTypes from 'prop-types';

import { useProductContext } from '@/react/contexts/STLProduct';

const VariantSizeComponent = ({ tagPrefix }) => {
  const { productId, setProductId, productData, variantSizeData } = useProductContext();

  const [hoverName, setHoverName] = useState('');

  const getSizeName = useCallback((product) => {
    const sizeTag = product.data.tags.find((tag) => tag.includes(tagPrefix));
    if (sizeTag) return sizeTag.slice(tagPrefix.length);
    return '';
  }, []);

  const displayName = useMemo(() => {
    if (!getSizeName) return '';
    return hoverName || getSizeName(productData);
  }, [hoverName, getSizeName, productData]);

  return (
    <div className="variant-container variant-size-container">
      {!!variantSizeData && !!variantSizeData.length && (
        <>
          <p className="title">
            <span>Size : </span>
            <span>{displayName}</span>
          </p>
          <ul>
            {variantSizeData.map((product) => {
              const { id } = product.data;
              const sizeName = getSizeName(product);
              return (
                <li
                  key={id}
                  data-product-id={id}
                  className={id === productId ? 'active' : ''}
                  onClick={() => setProductId(id)}
                  onMouseOver={() => setHoverName(sizeName)}
                  onMouseOut={() => setHoverName('')}
                >
                  {sizeName}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

VariantSizeComponent.propTypes = {
  tagPrefix: PropTypes.string.isRequired,
};

export default memo(VariantSizeComponent);
