import { useMemo } from 'react';

import { useProductContext } from '@/react/contexts/STLProduct';

const ProductPriceComponent = () => {

  const {
    variantDefaultData,
    variantDefaultIndex,
  } = useProductContext();

  const factoryPrice = useMemo(
    () => {
      if (!variantDefaultData || !variantDefaultData.length) return '';
      const data = variantDefaultData[variantDefaultIndex];
      return (data.price * 0.01).toFixed(2);
    },
    [variantDefaultData, variantDefaultIndex],
  );

  const regularPrice = useMemo(
    () => {
      if (!variantDefaultData || !variantDefaultData.length) return '';
      const data = variantDefaultData[variantDefaultIndex];
      return (data.compare_at_price * 0.01).toFixed(2);
    },
    [variantDefaultData, variantDefaultIndex],
  );

  const moneySaved = useMemo(
    () => {
      if (!variantDefaultData || !variantDefaultData.length) return '';
      const data = variantDefaultData[variantDefaultIndex];
      return ((data.compare_at_price - data.price) * 0.01).toFixed(2);
    },
    [variantDefaultData, variantDefaultIndex],
  );

  return (
    <div className="price-container">
      <div className="factory-price">
        <strong>${factoryPrice}</strong>
        <span className="regular-price">${regularPrice} </span>
      </div>
      <div className="money-saved">Save ${moneySaved}</div>
    </div>
  );
  
};

export default ProductPriceComponent;