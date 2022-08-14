import './GridItems.scss';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { productVariablesFormalization } from '@/react/utils/FastSimon';

const GridItem = (props) => {
  const {
    product,
    variant,
    windowWidth,
    discountBadge,
    mobileMode,
    onDelete,
    liClass = 'col-6 col-sm-4 col-lg-3',
  } = props;
  // export by Fast Simon SDK and Shopify search
  const { id, title, image, tags, personalized, variants, images } = productVariablesFormalization(product);

  const {
    id: variantID,
    title: variantTitle,
    url,
    compare_price: comparePrice,
    price,
    inventory_quantity: inventoryQuantity,
    inventory_policy: inventoryPolicy,
    sold_out: soldOut,
    threshold,
  } = variant;

  const moneySaving = (
    parseFloat(String(comparePrice).replaceAll(',')) - parseFloat(String(price).replaceAll(','))
  ).toFixed(2);

  const productElement = useRef();
  const [productElementStyle, setProductElementStyle] = useState({});

  // 240, 360, 540, 720
  const imgURL = new URL(image, 'https://www.efavormart.com');
  imgURL.searchParams.delete('width');
  imgURL.searchParams.append('width', '240');
  const img240 = imgURL.href;
  imgURL.searchParams.delete('width');
  imgURL.searchParams.append('width', '360');
  const img360 = imgURL.href;
  imgURL.searchParams.delete('width');
  imgURL.searchParams.append('width', '540');
  const img540 = imgURL.href;
  imgURL.searchParams.delete('width');
  imgURL.searchParams.append('width', '720');
  const img720 = imgURL.href;

  let unitCost;
  if (tags) {
    const tag = tags.find((t) => t.includes('single-unit-count-') || t.includes('single-unit-count_'));
    // console.log('tag', tag);
    if (tag) {
      const caseCount = parseInt(tag.replace('single-unit-count-', '').replace('single-unit-count_', ''), 10);
      unitCost = (price / caseCount).toFixed(2);
    }
  }

  // almost-gone
  let isAlmostGone = false;
  // console.log('id', id, 'inventoryQuantity',inventoryQuantity, 'variants', variants);
  if (variants && inventoryQuantity > 0 && threshold > 0 && inventoryQuantity < threshold) {
    isAlmostGone = true;
  }
  // console.log('isAlmostGone', isAlmostGone);

  // sold-out
  let isSoldOut = false;
  // console.log('id', id, 'inventoryQuantity', inventoryQuantity, 'inventoryPolicy', inventoryPolicy, 'soldOut', soldOut);
  if (inventoryQuantity < 1 && !(inventoryPolicy === 'continue' && soldOut.includes('Preorder: Available on'))) {
    isSoldOut = true;
  }
  // console.log('isSoldOut', isSoldOut);

  // pre-order
  let isPreOrder = false;
  let firstPreOrder;
  // console.log('id', id, 'inventoryQuantity', inventoryQuantity, 'inventoryPolicy', inventoryPolicy, 'soldOut', soldOut);
  if (inventoryQuantity < 1 && inventoryPolicy === 'continue' && soldOut.includes('Preorder: Available on')) {
    isPreOrder = true;
    firstPreOrder = soldOut.replace('Preorder: Available on', '').trim();
  }
  // console.log('isPreOrder', isPreOrder);

  let isDiscount = false;
  if (tags && discountBadge && discountBadge.length > 0) {
    isDiscount = discountBadge.find((badge) => {
      // badge.tag, badge.image
      return tags.includes(badge.tag);
    });
  }
  // console.log('isDiscount', isDiscount);

  useEffect(() => {
    // console.log('useEffect windowWidth');
    // console.log(windowWidth);
    if (productElement && !mobileMode) {
      // console.log(productElement.current);
      const imageHeight = productElement.current.getElementsByClassName('product-thumb')[0].clientHeight;
      const bodyHeight = productElement.current.getElementsByClassName('product-body')[0].clientHeight;
      // console.log(imageHeight, bodyHeight);
      setProductElementStyle({ maxHeight: imageHeight + bodyHeight });
    }
  }, [windowWidth]);

  const onNotifyMeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log('onNotifyMeClick');
    const { image, productId, variantId, title, price, regularPrice } = e.target.dataset;
    const { EventEmitter, POPUP_KLAVIYO_BIS } = window.TW.main;
    EventEmitter.emit(POPUP_KLAVIYO_BIS, {
      image,
      productId: productId * 1,
      variantId: variantId * 1,
      title,
      price: price * 100,
      regularPrice: regularPrice * 100,
      customerEmail: window.TW.customer?.email,
    });
  };

  const handleDeleteItem = () => {
    onDelete(variantID);
  };

  return (
    <li
      className={`grid-item ${liClass} col-6 col-sm-4 col-lg-2 ly__gr ${isSoldOut ? 'sold-out' : ''} ${
        isDiscount ? 'is-discount' : ''
      }`}
    >
      <div className="product product-card product-inner smallCard" ref={productElement} style={productElementStyle}>
        <form method="post" action="/cart/add">
          <div className="product-thumb images">
            <a
              className="aspectRatio lazyload gtm-grid-product"
              // data-include="/products/120-white-grandiose-rosette-3d-satin-round-tablecloth?view=imgscard"
              href={url}
              title={title}
              aria-label={title}
              style={{ '--ar_i': '100.0%' }}
              data-product-id={id}
              data-currentinclude=""
            >
              <div className="primary-thumb" data-ogr={image}>
                <img
                  width="800"
                  height="800"
                  className="nonwidth lazyautosizes lazyload ls-is-cached"
                  data-widths="[240, 360, 540, 720]"
                  data-aspectratio="1.0"
                  data-sizes="auto"
                  alt={title}
                  style={{}}
                  data-srcset={`${img240} 240w, ${img360} 360w, ${img540} 540w, ${img720} 720w`}
                  sizes="217px"
                />
              </div>
            </a>
            <div className="cta-btn">
              <div className="btn-remove-wishlist" onClick={handleDeleteItem}>
                <i className="icomoon-close" />
              </div>
              <button
                type="button"
                data-with-epi="true"
                className={`btn-add-to-wishlist swym-button swym-add-to-wishlist-view-product product_${id} btn-expandable rounded-circle mb-3 gtm-atw`}
                data-swaction="addToWishlist"
                data-product-id={id}
                data-variant-id={variantID}
                data-product-url={`https://www.efavormart.com${url}`}
                aria-label="Add to Wishlist"
              >
                <i className="icomoon-wishlist" />
                <span className="text-nowrap text-capitalize text-white">Wish List</span>
              </button>
            </div>
          </div>

          {(isAlmostGone || isSoldOut || isPreOrder || isDiscount) && (
            <div className="badge-container position-absolute">
              {isAlmostGone && (
                <img
                  className="badge-almost-gone position-absolute"
                  src={`${window.TW.assetPath}badge_almost_gone.svg`}
                  alt="almost gone"
                />
              )}
              {isSoldOut && (
                <img
                  className="badge-sold-out position-absolute"
                  src={`${window.TW.assetPath}badge_more_coming.svg`}
                  alt="more coming"
                />
              )}
              {isPreOrder && (
                <img
                  className="badge-pre-order position-absolute"
                  src={`${window.TW.assetPath}badge_pre_order.svg`}
                  alt="Pre order"
                />
              )}
              {isDiscount && <img className="badge-discount position-absolute" src={isDiscount.image} alt="discount" />}
            </div>
          )}

          {!isSoldOut && personalized && (
            <div className="product-cta-wrapper">
              <a
                href={url}
                className="btn btn-outline-darker btn-block text-uppercase kt-button btn-onclick prevent-children"
                data-vrid={variantID}
                data-pid={id}
              >
                <span className="text-nowrap addItemAjax-text text-capitalize">Customize</span>
              </a>
            </div>
          )}
          {!isSoldOut && !personalized && (
            <div className="product-cta-wrapper">
              <input type="hidden" name="id" value={variantID} />
              <input type="hidden" name="quantity" value="1" />
              {isPreOrder && (
                <>
                  <input
                    className="hidden-input"
                    type="hidden"
                    name="properties[In Stock]"
                    value={`Preorder: Available on ${firstPreOrder}`}
                  />
                  <input className="hidden-input" type="hidden" name="properties[date_diff]" value={firstPreOrder} />
                </>
              )}
              <div
                data-submit=""
                className="btn btn-outline-darker btn-block fkt-cart-plus text-uppercase btn-cart kt-button btn-onclick add_to_cart_button addItemAjax gtm-grid-atc"
                data-vrid={variantID}
                data-pid={id}
                data-product-id={id}
              >
                <span className="text-nowrap addItemAjax-text text-capitalize">Add to cart</span>
              </div>
            </div>
          )}
          {isSoldOut && (
            <div className="product-cta-wrapper">
              <button
                onClick={onNotifyMeClick}
                type="button"
                className="btn btn-outline-darker btn-block text-uppercase kt-button btn-onclick add_to_cart_button prevent-children"
                data-vrid={variantID}
                data-pid={id}
                data-image={image}
                data-title={title}
                data-price={price}
                data-regular-price={comparePrice}
                data-product-id={id}
                data-variant-id={variantID}
              >
                <span className="text-nowrap addItemAjax-text text-capitalize">Notify Me</span>
              </button>
            </div>
          )}

          <div className="product-body text-left">
            <h2 className="product-name mh-100">
              <a className="gtm-grid-product" data-product-id={id} href={url} tabIndex="0">
                <span className="product-title">{title}</span>
                <span className="variant-title">{variantTitle}</span>
              </a>
            </h2>
            <span className="product-price justify-content-start">
              <ins className={`ProductPrice-${id} font-weight-bold`} data-id={id}>
                ${price}
              </ins>
              <del className={`ComparePrice-${id}`}>${comparePrice}</del>
              <span className="money-saved w-100">Save ${moneySaving}</span>
            </span>
            {unitCost && <span className="as-low-as">{`As low as $${unitCost} each`}</span>}
          </div>
        </form>
      </div>
    </li>
  );
};

GridItem.propTypes = {
  product: PropTypes.object.isRequired,
  variant: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired,
  discountBadge: PropTypes.array,
  mobileMode: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

GridItem.defaultProps = {
  discountBadge: null,
};

export default GridItem;
