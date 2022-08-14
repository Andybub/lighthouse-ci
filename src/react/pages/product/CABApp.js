import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './CABApp.scss';
import TheSwiper from '@/react/pages/product/TheSwiper';
import { getProductsById } from '@/service/ProductAPI';

const MIN = 8;
const MAX = 20;

const CABApp = ({ productId, rootId }) => {
  const [products, setProducts] = useState([]);

  const isNotPromoAD = useCallback((prodInfo) => {
    const { title, tags } = prodInfo;
    if (title.toLowerCase().includes('promo tile')) return false;
    if (tags.includes((tag) => tag.toLowerCase() === 'isp_promo_ads')) return false;
    return true;
  }, []);

  const isAvailable = useCallback((prodInfo) => {
    const { inventory_quantity: quantity } = prodInfo;
    return quantity > 0;
  }, []);

  useEffect(() => {
    window.FastSimonSDK.productRecommendation({
      withAttributes: false,
      productID: productId,
      specs: [
        {
          sources: ['related_purchase', 'related_cart', 'related_views'],
          maxSuggestions: MAX,
          widgetID: 'product-cab-widget',
        },
      ],
      callback: ({ payload }) => {
        console.log('CAB callback', { productId, payload });
        const domRoot = document.getElementById('tw-cab-app');
        if (!payload || !payload.length) {
          domRoot.style.display = 'none';
          return;
        }
        const [{ payload: productArray }] = payload;
        const idArray = productArray.map(({ id }) => id);
        getProductsById(idArray)
          .then((result) => result.filter(isAvailable))
          .then((result) => result.filter(isNotPromoAD))
          .then((result) => {
            console.log(`CAB --> ${result.length}`);
            if (result.length < MIN) {
              domRoot.style.display = 'none';
              return;
            }
            setProducts(
              result.map((info) => {
                const fsData = productArray.find(({ id }) => info.id === +id);
                return {
                  id: info.id,
                  variantId: info.variants[0].id,
                  personalized: info.personalized,
                  title: fsData.l,
                  price: `$${fsData.p}`,
                  regularPrice: `$${fsData.p_c}`,
                  imageUrl: fsData.t,
                  imageUrl2: fsData.t2,
                  href: fsData.u,
                };
              }),
            );
          })
          .catch((err) => {
            console.error(err);
            domRoot.style.display = 'none';
          });
      },
    });
  }, []);

  return (
    <div className="cab-container w-100">
      {!!products && !!products.length && (
        <>
          <h2 className="cab-title container-fluid">Customer Also Bought</h2>
          <TheSwiper products={products} rootId={rootId} position="cab" />
        </>
      )}
    </div>
  );
};

CABApp.propTypes = {
  productId: PropTypes.string.isRequired,
  rootId: PropTypes.string.isRequired,
};

export default CABApp;
