import { useState, useCallback, useMemo, useRef, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import './GridProductItem.scss';
import QuantityToggle from '@/react/ui/stl/QuantityToggle';
import { useModalContext } from '@/react/contexts/STLModal';
import ProductCTA from '@/react/ui/stl/ProductCTA';

const GridProductItem = ({ product }) => {
  const refItem = useRef();

  const { popupProduct, setPopupProduct, hoveredProductId, setHoveredProductId, respondMobile } = useModalContext();

  const [quantity, setQuantity] = useState(1);

  const assetPath = useMemo(() => {
    const { assetsPath: path } = document.getElementById('tw-main-script').dataset;
    return path;
  }, []);

  const isHover = useMemo(() => hoveredProductId === product.product_id, [product, hoveredProductId]);

  const factoryPrice = useMemo(() => {
    return (product.data.price / 100).toFixed(2);
  }, [product]);

  const regularPrice = useMemo(() => {
    return (product.data.compare_at_price / 100).toFixed(2);
  }, [product]);

  const moneySaved = useMemo(() => {
    return (regularPrice - factoryPrice).toFixed(2);
  }, [factoryPrice, regularPrice]);

  useEffect(() => {
    if (respondMobile || !refItem.current) return;
    if (isHover) {
      refItem.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isHover, respondMobile]);

  const handlePopupProduct = useCallback(() => {
    const { product_id: id } = product;
    if (id) setPopupProduct(id);
  }, [product, setPopupProduct]);

  const onMouseLeave = () => {
    if (popupProduct) {
      setHoveredProductId(popupProduct);
    } else {
      setHoveredProductId(0);
    }
  };

  return (
    <li
      className={`grid-product-item${respondMobile ? ' swiper-slide' : ''}`}
      onMouseEnter={() => setHoveredProductId(product.product_id)}
      onMouseLeave={onMouseLeave}
      ref={refItem}
    >
      <div
        className={`product-box${isHover ? ' mouse-enter' : ''}`}
        data-product-id={product.product_id}
        data-product-sku={product.sku}
      >
        <div className="product-tag">
          {!product.available && (
            <img className="tag tag-more-coming" src={`${assetPath}badge_more_coming.svg`} alt="More Coming" />
          )}
          {product.preorder && (
            <img className="tag tag-pre-order" src={`${assetPath}badge_pre_order.svg`} alt="Preorder" />
          )}
          {product.almostGone && (
            <img className="tag tag-almost-gone" src={`${assetPath}badge_almost_gone.svg`} alt="Almost Gone" />
          )}
        </div>
        <div className="product-img gtm-stl-product" data-product-id={product.product_id} onClick={handlePopupProduct}>
          <img src={product.data.image_url} alt={product.title} />
        </div>
        <div className="product-info">
          <p className="title gtm-stl-product" data-product-id={product.product_id} onClick={handlePopupProduct}>
            {product.title}
          </p>
          <div
            className="price-container gtm-stl-product"
            data-product-id={product.product_id}
            onClick={handlePopupProduct}
          >
            <div className="factory-price">
              <strong>${factoryPrice}</strong>
              <span className="regular-price">${regularPrice} </span>
            </div>
            <div className="money-saved">Save ${moneySaved}</div>
          </div>
          <div className="product-buy d-none d-md-flex">
            {!product.customize && product.available && (
              <QuantityToggle quantity={quantity} setQuantity={setQuantity} />
            )}
            <ProductCTA product={product} quantity={quantity} />
          </div>
        </div>
        <div className="product-buy d-flex d-md-none">
          {!product.customize && product.available && <QuantityToggle quantity={quantity} setQuantity={setQuantity} />}
          <ProductCTA product={product} quantity={quantity} />
        </div>
      </div>
    </li>
  );
};

GridProductItem.propTypes = {
  product: PropTypes.object.isRequired,
};

export default memo(GridProductItem);
