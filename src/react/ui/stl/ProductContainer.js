import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import CustomScrollbar from 'react-custom-scrollbars';
import './ProductDetail.scss';
import { getVariantsByProduct, getVariantsByCollection } from '@/react/api/stl';
import { useModalContext } from '@/react/contexts/STLModal';
import { useProductContext, withProductContext } from '@/react/contexts/STLProduct';
import ProductPriceComponent from '@/react/ui/stl/ProductPriceComponent';
import VariantSizeComponent from '@/react/ui/stl/VariantSizeComponent';
import VariantColorComponent from '@/react/ui/stl/VariantColorComponent';
import VariantStyleComponent from '@/react/ui/stl/VariantStyleComponent';
import VariantDefaultComponent from '@/react/ui/stl/VariantDefaultComponent';
import QuantityToggle from '@/react/ui/stl/QuantityToggle';
import ProductCTA from '@/react/ui/stl/ProductCTA';
import Loading from '@/react/ui/stl/Loading';
import { enablePreorder, underThreshold, availableMessage, inventoryQuantity } from '@/react/utils/stl';

const ProductContainer = ({ lookData }) => {
  const sizePrefix = 'size-';
  const colorPrefix = 'color-';
  const stylePrefix = 'vstylev-';

  const [loading, setLoading] = useState(true);

  const imageRef = useRef();

  const { popupProduct, setPopupProduct } = useModalContext();

  const {
    productId,
    setProductId,
    relativeData,
    setRelativeData,
    productData,
    setProductData,
    setVariantSizeData,
    setVariantColorData,
    setVariantStyleData,
    variantDefaultData,
    setVariantDefaultData,
    variantDefaultIndex,
    setVariantDefaultIndex,
    quantity,
    setQuantity,
  } = useProductContext();

  const removeDuplicatedProducts = (product, index, array) => {
    const filterMap = array.map(({ data }) => data.id === product.data.id);
    const lastIndex = filterMap.lastIndexOf(true);
    return index === lastIndex;
  };

  const removeNonPrefixProducts = (prefix) => (product) => {
    if (prefix === colorPrefix && product.color_override) {
      return true;
    }
    const targetTag = product.data.tags.find((tag) => tag.includes(prefix));
    return !!targetTag;
  };

  const resizeFeatureImage = (image) => {
    return image.replace('.jpg?v=', '_400x400.jpg?v=');
  };

  const variantAvailable = useMemo(() => {
    if (!productData) return true;
    return productData.data.variants[variantDefaultIndex].available;
  }, [productData, variantDefaultIndex]);

  const variantAlmostGone = useMemo(() => {
    if (!productData) return false;
    return underThreshold(productData, variantDefaultIndex);
  }, [productData, variantDefaultIndex]);

  const almostGoneMessage = useMemo(() => {
    if (!productData) return '';
    const numQuantity = inventoryQuantity(productData, variantDefaultIndex);
    const preorderMsg = availableMessage(productData, variantDefaultIndex);
    if (!preorderMsg) return `Only ${numQuantity} left in stock!`;
    return `Only ${numQuantity} left in stock! ${preorderMsg.replace('Preorder: Available', 'More coming')}`;
  }, [productData, variantDefaultIndex]);

  useEffect(() => {
    if (!imageRef.current) return;
    imageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [productId]);

  useEffect(() => {
    setLoading(true);
    if (!productId || !relativeData) return;
    const targetProduct = relativeData.find(({ data }) => data.id === productId);
    if (!targetProduct) {
      console.error('NO Product Matched !!! 1');
      return;
    }
    const defaultVariants = targetProduct.data.variants;
    const { tags } = targetProduct.data;
    const colorTag = tags.find((tag) => tag.includes('variant-'));
    const sizeTag = tags.find((tag) => tag.includes('variantsizev-'));
    const styleTag = tags.find((tag) => tag.includes('variantstylev-'));
    const colorVariants = relativeData
      .filter(({ data }) => data.tags.includes(colorTag))
      .filter(removeNonPrefixProducts(colorPrefix))
      .filter(removeDuplicatedProducts);
    const sizeVariants = relativeData
      .filter(({ data }) => data.tags.includes(sizeTag))
      .filter(removeNonPrefixProducts(sizePrefix))
      .filter(removeDuplicatedProducts);
    const styleVariants = relativeData
      .filter(({ data }) => data.tags.includes(styleTag))
      .filter(removeNonPrefixProducts(stylePrefix))
      .filter(removeDuplicatedProducts);
    setVariantColorData(colorVariants);
    setVariantSizeData(sizeVariants);
    setVariantStyleData(styleVariants);
    setVariantDefaultData(defaultVariants);
    setVariantDefaultIndex(0);
    setProductData(targetProduct);
    setLoading(false);
  }, [
    productId,
    relativeData,
    setProductData,
    setVariantColorData,
    setVariantSizeData,
    setVariantStyleData,
    setVariantDefaultData,
    setVariantDefaultIndex,
  ]);

  useEffect(() => {
    const { products } = lookData;
    if (!popupProduct || !products || !products.length) {
      setProductId(0);
      setRelativeData(null);
      return;
    }
    const targetProduct = products.find(({ product_id: id }) => id === popupProduct);
    if (!targetProduct) {
      console.error('NO Product Matched !!! 2');
      return;
    }
    const { collection, collection_size: sizeCollection, collection_style: styleCollection } = targetProduct.data;
    const targetCollection = collection || sizeCollection || styleCollection || '';
    if (!targetCollection) {
      getVariantsByProduct(targetProduct.handle)
        .then((data) => {
          // console.log(targetProduct, data);
          targetProduct.caseQty = targetProduct.data.caseQty;
          targetProduct.unit_name = targetProduct.data.unit_name;
          // checking inventory status
          const { available, type } = data;
          const customize = type === 'Personalized';
          const preorder = enablePreorder(data);
          const almostGone = underThreshold(data);
          const preorderMsg = availableMessage(data);
          const numQuantity = inventoryQuantity(data);
          // console.log(available, customize, preorder, almostGone, preorderMsg, numQuantity);
          setRelativeData([
            { ...targetProduct, data, available, customize, preorder, almostGone, preorderMsg, numQuantity },
          ]);
          setProductId(popupProduct);
        })
        .catch((err) => {
          console.error(err);
          setRelativeData(null);
          setProductId(0);
        });
    } else {
      getVariantsByCollection(targetCollection)
        .then((result) => {
          setRelativeData(
            result.products.map((product) => {
              // console.log(index, product);
              const { data } = product;
              // checking inventory status
              const { available, type } = data;
              const customize = type === 'Personalized';
              const preorder = enablePreorder(data);
              const almostGone = underThreshold(product);
              const preorderMsg = availableMessage(product);
              const numQuantity = inventoryQuantity(data);
              // console.log(available, customize, preorder, almostGone, preorderMsg, numQuantity);
              return { ...product, available, customize, preorder, almostGone, preorderMsg, numQuantity };
            }),
          );
          setProductId(popupProduct);
        })
        .catch((err) => {
          console.error(err);
          setRelativeData(null);
          setProductId(0);
        });
    }
  }, [popupProduct, lookData, setProductId, setRelativeData]);

  return (
    <div className="stl-detail-container">
      <div className="stl-detail-wrapper body-scroll-lock-ignore">
        {loading && <Loading />}
        {!loading && productData && (
          <>
            <button type="button" className="btn-back" onClick={() => setPopupProduct(0)}>
              <span className="icomoon-arrow-3" />
              <span>Back To List</span>
            </button>
            <div className="stl-detail-scroller">
              <CustomScrollbar renderView={(props) => <div {...props} className="stl-detail-scroll-view" />}>
                <div className="product-img" ref={imageRef}>
                  <img src={resizeFeatureImage(productData.data.featured_image)} alt={productData.data.title} />
                </div>
                <div className="product-info">
                  <p className="title">{productData.data.title}</p>
                  <ProductPriceComponent />
                  <VariantColorComponent tagPrefix={colorPrefix} />
                  <VariantSizeComponent tagPrefix={sizePrefix} />
                  <VariantStyleComponent tagPrefix={stylePrefix} />
                  <VariantDefaultComponent />
                  <div className="bottom-container">
                    {!productData.customize && variantAvailable && (
                      <QuantityToggle quantity={quantity} setQuantity={setQuantity} />
                    )}
                    <ProductCTA
                      product={productData}
                      variant={variantDefaultData[variantDefaultIndex]}
                      quantity={quantity}
                    />
                  </div>
                  {variantAlmostGone && <div className="almost-gone-message">{almostGoneMessage}</div>}
                </div>
              </CustomScrollbar>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

ProductContainer.propTypes = {
  lookData: PropTypes.object.isRequired,
};

export default withProductContext(ProductContainer);
