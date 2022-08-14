import { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { addToCart, getCart } from '@/react/api/stl';

const ProductCTA = ({ product, variant, quantity }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isCustomize = useMemo(() => {
    if (!product) return false;
    return product.data.type === 'Personalized';
  }, [product]);

  const isAvailable = useMemo(() => {
    if (!product) return true;
    if (variant) return variant.available;
    return product.data.variants[0].available;
  }, [product, variant]);

  const isPreorder = useMemo(() => {
    if (!product) return false;
    const targetVariant = variant || product.data.variants[0];
    if (!targetVariant) return false;
    const { inventory_policy: inventoryPolicy, inventory_quantity: inventoryQuantity } = targetVariant;
    return inventoryQuantity < 1 && inventoryPolicy === 'continue';
  }, [product, variant]);

  const productUrl = useMemo(() => {
    if (!product) return '';
    const handle = product.handle ? product.handle : product.data.handle;
    return `https://www.efavormart.com/products/${handle}`;
  }, [product]);

  const buttonClassName = useMemo(() => {
    const classnames = [
      'tw-stl-cta-button',
      isAvailable ? 'gtm-stl-atc' : '',
      variant ? 'with-variant' : '',
      loading ? 'is-loading' : '',
      success ? 'is-success' : '',
      isCustomize ? 'is-customize' : '',
      !isAvailable ? 'btn-klaviyo-bis-trigger' : '',
    ];
    return classnames.filter((name) => name).join(' ');
  }, [variant, isCustomize, isAvailable, loading, success]);

  const variantPrice = useMemo(() => {
    const price = !variant ? product.data.price : variant.price;
    return (price * 0.01).toFixed(2);
  }, [product, variant]);

  const variantRegularPrice = useMemo(() => {
    const price = !variant ? product.data.compare_at_price : variant.compare_at_price;
    return (price * 0.01).toFixed(2);
  }, [product, variant]);

  const textCTA = useMemo(() => {
    if (isCustomize) return 'Customize';
    if (loading) return 'Sending...';
    if (isPreorder) {
      if (success) return 'Added !';
      return 'Pre Order';
    }
    if (success) return 'Added !';
    return 'Add To Cart';
  }, [isCustomize, isPreorder, loading, success]);

  const textAvailable = useMemo(() => {
    if (!isPreorder) return '';
    const arr = product.sold_out || product.data.sold_out || product.data.inventory;
    if (variant) {
      const index = product.data.variants.findIndex(({ id }) => id === variant.id);
      return arr[index].available_date || arr[index];
    }
    return arr[0].available_date || arr[0];
  }, [isPreorder, product, variant]);

  const handleCTA = useCallback(async () => {
    if (!isAvailable) {
      console.log(product, variant);
      const { customerEmail } = document.getElementById('tw-main-script').dataset;
      const bisData = {
        productId: product.data.id,
        customerEmail,
      };
      const { EventEmitter, POPUP_KLAVIYO_BIS } = window.TW.main;
      EventEmitter.emit(POPUP_KLAVIYO_BIS, !variant ? {
        ...bisData,
        variantId: product.data.variants[0].id,
        title: product.title,
        image: product.image_url,
        price: product.data.price,
        regularPrice: product.data.compare_at_price,
      } : {
        ...bisData,
        variantId: variant.id,
        title: variant.name,
        image: product.data.featured_image,
        price: variant.price,
        regularPrice: variant.compare_at_price,
      });
      return;
    }
    setLoading(true);

    const itemsData = {
      id: variant ? variant.id : product.data.variants[0].id,
      quantity,
    };
    if (isPreorder) {
      itemsData.properties = {
        'In Stock': textAvailable,
        date_diff: textAvailable.replace('Preorder: ', '').replace('Available on  ', ''),
      };
    }

    await addToCart([itemsData]);

    const { items } = await getCart();

    setSuccess(true);
    setLoading(false);

    const cartCounts = items.reduce((num, item) => {
      // Personalized Rush Production Time ==> not include in cart counts
      if (String(item.id) === '39308598083630') return num;
      return num + item.quantity;
    }, 0);

    $('.cart-count').text(cartCounts);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  }, [product, variant, quantity, isAvailable, isPreorder, textAvailable]);

  return (
    <>
      {!isCustomize && (
        <button
          type="button"
          onClick={handleCTA}
          className={buttonClassName}
          data-image={!variant ? product.image_url : product.data.featured_image}
          data-title={!variant ? product.title : variant.name}
          data-price={variantPrice}
          data-regular-price={variantRegularPrice}
          data-product-id={product.data.id}
          data-variant-id={!variant ? product.variant_id : variant.id}
          data-product-sku={!variant ? product.sku : variant.sku}
          data-product-handle={!isAvailable ? product.handle : ''}
        >
          {loading && (
            <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                  <stop stopColor="#fff" stopOpacity="0" offset="0%" />
                  <stop stopColor="#fff" stopOpacity=".631" offset="63.146%" />
                  <stop stopColor="#fff" offset="100%" />
                </linearGradient>
              </defs>
              <g fill="none" fillRule="evenodd">
                <g transform="translate(1 1)">
                  <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" strokeWidth="2">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 18 18"
                      to="360 18 18"
                      dur="0.9s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <circle fill="#fff" cx="36" cy="18" r="1">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 18 18"
                      to="360 18 18"
                      dur="0.9s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              </g>
            </svg>
          )}
          {!loading && isAvailable && textCTA}
          {!loading && !isAvailable && (
            <>
              <span className="icomoon-email" /> Notify Me
            </>
          )}
          {!!textAvailable && <span className="preorder-message">{textAvailable}</span>}
        </button>
      )}
      {isCustomize && (
        <a
          className={buttonClassName}
          data-product-id={product.data.id}
          data-variant-id={!variant ? 0 : variant.id}
          data-product-sku={!variant ? product.sku : variant.sku}
          href={productUrl}
        >
          {textCTA}
        </a>
      )}
    </>
  );
};

ProductCTA.propTypes = {
  product: PropTypes.object.isRequired,
  variant: PropTypes.object,
  quantity: PropTypes.number.isRequired,
};

ProductCTA.defaultProps = {
  variant: undefined,
};

export default ProductCTA;
