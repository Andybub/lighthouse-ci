import { createContext, useContext, useState, useMemo, useEffect } from 'react';

const ProductContext = createContext(null);

export const useProductContext = () => useContext(ProductContext);

export const withProductContext = Component => props => {

  const [productId, setProductId] = useState(0);
  const [productData, setProductData] = useState(null);
  const [relativeData, setRelativeData] = useState(null);

  const [variantSizeData, setVariantSizeData] = useState(null);
  const [variantColorData, setVariantColorData] = useState(null);
  const [variantStyleData, setVariantStyleData] = useState(null);
  const [variantDefaultData, setVariantDefaultData] = useState(null);
  const [variantDefaultIndex, setVariantDefaultIndex] = useState(0);

  const [quantity, setQuantity] = useState(1);

  const productProviderValue = useMemo(() => ({
    productId, setProductId,
    productData, setProductData,
    relativeData, setRelativeData,
    variantSizeData, setVariantSizeData,
    variantColorData, setVariantColorData,
    variantStyleData, setVariantStyleData,
    variantDefaultData, setVariantDefaultData,
    variantDefaultIndex, setVariantDefaultIndex,
    quantity, setQuantity,
  }), [
    productId, productData, relativeData,
    variantSizeData, variantColorData, variantStyleData,
    variantDefaultData, variantDefaultIndex, quantity,
  ]);

  useEffect(() => {
    console.log(productId, productData);
  }, [productId, productData]);

  return (
    <ProductContext.Provider value={productProviderValue}>
      <Component {...props} />
    </ProductContext.Provider>
  );
};
