import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import './RVApp.scss';
import TheSwiper from '@/react/pages/product/TheSwiper';

const RVApp = ({ source, rootId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(
      source.map(
        ({ product_id: id, image_url: imageUrl, handle, title, price, compare_at_price_max: regularPrice }) => ({
          id: +id,
          title,
          href: `/products/${handle}`,
          price,
          regularPrice,
          imageUrl,
        }),
      ),
    );
  }, []);

  return (
    <div className="rv-container w-100">
      {!!products && !!products.length && (
        <>
          <h2 className="rv-title container-fluid">Recently Viewed</h2>
          <TheSwiper products={products} rootId={rootId} position="rv" />
        </>
      )}
    </div>
  );
};

RVApp.propTypes = {
  source: PropTypes.arrayOf(
    PropTypes.shape({
      product_id: PropTypes.string.isRequired,
      image_url: PropTypes.string.isRequired,
      handle: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      compare_at_price_max: PropTypes.string.isRequired,
    }),
  ).isRequired,
  rootId: PropTypes.string.isRequired,
};

export default RVApp;
