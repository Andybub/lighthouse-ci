import { memo, useRef, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './ImageDots.scss';
import { useModalContext } from '@/react/contexts/STLModal';

const ImageDots = ({ title, imageUrl, products }) => {
  const {
    respondMobile,
    popupProduct,
    setPopupProduct,
    setLookRatio,
    lookWidth,
    setLookWidth,
    hoveredProductId,
    setHoveredProductId,
    setSwiperIndex,
  } = useModalContext();

  const rootRef = useRef();

  const [loading, setLoading] = useState(true);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageStyle, setImageStyle] = useState(null);

  const onDotMouseEnter = (id) => {
    return () => {
      if (!respondMobile) {
        setHoveredProductId(id);
      }
    };
  };

  const onDotMouseLeave = () => {
    if (!respondMobile) {
      if (popupProduct) {
        setHoveredProductId(popupProduct);
      } else {
        setHoveredProductId(0);
      }
    }
  };

  const onDotClick = (id) => {
    return () => {
      if (respondMobile) {
        const index = products.findIndex((product) => product.product_id === id);
        setSwiperIndex(index);
      } else {
        setPopupProduct(id);
      }
    };
  };

  const ChildElements = products.map((product) => {
    const { product_id: id } = product;
    const style = {
      left: `${product.x_coord}%`,
      top: `${product.y_coord}%`,
    };
    return (
      <li
        className={`dot tw-stl-image-dot ${hoveredProductId === id ? 'mouse-enter' : ''} gtm-stl-dot`}
        data-product-id={id}
        data-product-sku={product.sku}
        onClick={onDotClick(id)}
        style={style}
        key={id}
        onMouseEnter={onDotMouseEnter(id)}
        onMouseLeave={onDotMouseLeave}
      />
    );
  });

  const handleResize = useCallback(() => {
    console.log('handleResize', imageWidth, imageHeight);
    if (!imageWidth || !imageHeight || !rootRef.current) return;
    const { clientWidth, clientHeight } = rootRef.current;
    console.log('rootRef', clientWidth, clientHeight);
    let ratio = 1;
    if (!clientWidth) ratio = clientHeight / imageHeight;
    else if (!clientHeight) ratio = clientWidth / imageWidth;
    else ratio = Math.min(clientWidth / imageWidth, clientHeight / imageHeight);
    console.log('ratio', ratio);
    const width = Math.round(imageWidth * ratio);
    const height = Math.round(imageHeight * ratio);
    console.log('image', width, height);
    setImageStyle({
      width: `${width}px`,
      height: `${height}px`,
    });
    console.log('lookWidth', lookWidth);
    if (lookWidth !== clientWidth) setLookWidth(clientWidth);
  }, [imageWidth, imageHeight, lookWidth, setLookWidth]);

  useEffect(() => {
    if (imageWidth && imageHeight) handleResize();
  }, [imageWidth, imageHeight, handleResize]);

  useEffect(() => {
    setLookRatio(1);
    setLoading(true);
    const image = new Image();
    image.onload = () => {
      setImageWidth(image.width);
      setImageHeight(image.height);
      setLookRatio(image.width / image.height);
      setLoading(false);
    };
    image.onerror = (e) => console.error(e);
    image.src = imageUrl;
  }, [imageUrl, setLookRatio]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      setSwiperIndex(0);
    };
  }, [handleResize, setSwiperIndex]);

  return (
    <div className="stl-img-container" ref={rootRef}>
      <img src={imageUrl} alt={title} style={imageStyle} />
      {!loading && (
        <ul className="dots-container" style={imageStyle}>
          {ChildElements}
        </ul>
      )}
    </div>
  );
};

ImageDots.propTypes = {
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  products: PropTypes.array,
};

ImageDots.defaultProps = {
  title: '',
  imageUrl: '',
  products: [],
};

export default memo(ImageDots);
