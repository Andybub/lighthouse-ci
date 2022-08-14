import '@/react/pages/collection/grid-items/GridItems.scss';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReviewStars from '@/react/pages/collection/grid-items/ReviewStars';
import { productVariablesFormalization, isPromoTile, stlId, stlHref } from '@/react/utils/FastSimon';
import { quickViewClickTracking, productClickTracking, addToCartClickTracking } from '@/utils/FastSimonTracking';

const GridItem = (props) => {
  // console.log('');
  // console.log('GridItem');
  // console.log('product.images', product.images);
  // console.log(product);
  const {
    index,
    product,
    windowWidth,
    discountBadge,
    mobileMode,
    inCartQuantity,
    liClass = 'col-6 col-sm-4 col-lg-3',
  } = props;
  // export by Fast Simon SDK and Shopify search
  const {
    id,
    url,
    title,
    image,
    variantID,
    price,
    comparePrice,
    tags,
    type,
    review,
    reviewsAverage,
    reviewsCount,
    personalized,
    size,
    inventoryQuantity,
    inventoryPolicy,
    soldOut,
    variants,
    images,
    description,
  } = productVariablesFormalization(product);

  const moneySaving = (
    parseFloat(String(comparePrice).replaceAll(',')) - parseFloat(String(price).replaceAll(','))
  ).toFixed(2);

  const productElement = useRef();

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

  const [imageHover, setImageHover] = useState('');
  const [img240Hover, setImg240Hover] = useState('');
  const [img360Hover, setImg360Hover] = useState('');
  const [img540Hover, setImg540Hover] = useState('');
  const [img720Hover, setImg720Hover] = useState('');

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
  if (variants && inventoryQuantity > 0 && variants[0].threshold > 0 && inventoryQuantity < variants[0].threshold) {
    isAlmostGone = true;
  }
  // console.log('isAlmostGone', isAlmostGone);

  // sold-out
  let isSoldOut = false;
  // console.log('id', id, 'inventoryQuantity',inventoryQuantity, 'inventoryPolicy', inventoryPolicy, 'soldOut', soldOut);
  if (
    inventoryQuantity < 1 &&
    soldOut &&
    !(inventoryPolicy === 'continue' && soldOut && soldOut.length > 0 && soldOut[0].includes('Preorder: Available on'))
  ) {
    isSoldOut = true;
  }
  // console.log('isSoldOut', isSoldOut);

  // pre-order
  let isPreOrder = false;
  let firstPreOrder;
  // console.log('id', id, 'inventoryQuantity',inventoryQuantity, 'inventoryPolicy', inventoryPolicy, 'soldOut', soldOut);
  if (
    inventoryQuantity < 1 &&
    inventoryPolicy === 'continue' &&
    soldOut &&
    soldOut.length > 0 &&
    soldOut[0].includes('Preorder: Available on')
  ) {
    isPreOrder = true;
    firstPreOrder = soldOut[0].replace('Preorder: Available on', '').trim();
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

  const isPromo = isPromoTile(title, tags);
  // console.log('isPromo', isPromo);

  useEffect(() => {
    // console.log('useEffect product', product.id);
    // console.log(product);
    // imageHover will update later
    if (images && imageHover !== images[1]) {
      setImageHover(images[0]);
    }
    // console.log('imageHover', imageHover);
  }, [product]);

  useEffect(() => {
    // console.log('useEffect', 'imageHover', imageHover);
    if (imageHover) {
      const imgHoverURL = new URL(imageHover, 'https://www.efavormart.com');
      imgHoverURL.searchParams.delete('width');
      imgHoverURL.searchParams.append('width', '240');
      setImg240Hover(imgHoverURL.href);
      imgHoverURL.searchParams.delete('width');
      imgHoverURL.searchParams.append('width', '360');
      setImg360Hover(imgHoverURL.href);
      imgHoverURL.searchParams.delete('width');
      imgHoverURL.searchParams.append('width', '540');
      setImg540Hover(imgHoverURL.href);
      imgHoverURL.searchParams.delete('width');
      imgHoverURL.searchParams.append('width', '720');
      setImg720Hover(imgHoverURL.href);
    }
  }, [imageHover]);

  const onNotifyMeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log('onNotifyMeClick');
    const { image, productId, variantId, title, price, regularPrice } = e.target.dataset;
    const { EventEmitter, POPUP_KLAVIYO_BIS } = window.TW.main;
    const { customerEmail } = document.getElementById('tw-main-script').dataset;
    EventEmitter.emit(POPUP_KLAVIYO_BIS, {
      image,
      productId: productId * 1,
      variantId: variantId * 1,
      title,
      price: price * 100,
      regularPrice: regularPrice * 100,
      customerEmail,
    });
  };

  const onQuickViewClick = () => {
    quickViewClickTracking({ productID: id, position: index + 1 });
  };

  const onItemClick = () => {
    productClickTracking({ productID: id, position: index + 1 });
  };

  const onAddToCartClick = () => {
    addToCartClickTracking({ productID: id });
  };

  return (
    <li className={`grid-item ${liClass} ly__gr ${isSoldOut ? 'sold-out' : ''} ${isDiscount ? 'is-discount' : ''}`}>
      <div className="product product-card product-inner smallCard" ref={productElement} data-promo-ads={isPromo}>
        <form method="post" action="/cart/add">
          <div className="product-thumb images">
            <a
              className={`${isPromo ? 'gtm-promo-tile' : 'aspectRatio gtm-grid-product'} lazyload`}
              // data-include="/products/120-white-grandiose-rosette-3d-satin-round-tablecloth?view=imgscard"
              onClick={onItemClick}
              href={isPromo ? stlHref(description) : url}
              title={title}
              aria-label={title}
              style={{ '--ar_i': '100.0%' }}
              data-product-id={id}
              data-currentinclude=""
              data-stl-id={isPromo ? stlId(description) : ''}
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
              {imageHover && img240Hover && img360Hover && img540Hover && img720Hover && (
                <div className="second-thumb">
                  <img
                    width="1600"
                    height="1600"
                    className="nonwidth lazyautosizes lazyload ls-is-cached"
                    data-widths="[240, 360, 540, 720]"
                    data-aspectratio="1.0"
                    data-sizes="auto"
                    alt={title}
                    style={{}}
                    data-srcset={`${img240Hover} 240w, ${img360Hover} 360w, ${img540Hover} 540w, ${img720Hover} 720w`}
                    sizes="217px"
                  />
                </div>
              )}
            </a>
            {size && <span className="sizing position-absolute">{size}</span>}
            <div className="cta-btn">
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
                <i className="icomoon-wishlist-solid" />
                <span className="text-nowrap text-capitalize text-white">Wish List</span>
              </button>
              {!personalized && (
                <div
                  onClick={onQuickViewClick}
                  className="btn-outline-darker btn-product-icon btn-expandable quick-view fkt-binoculars kt-button d-none d-lg-flex gtm-click-qv"
                  data-view={url}
                  data-target="#md_qvModal"
                  data-product-id={id}
                >
                  <i className="icomoon-quick-view" />
                  <span className="text-nowrap">Quick view</span>
                </div>
              )}
            </div>
          </div>

          {(isAlmostGone || isSoldOut || isPreOrder || isDiscount) && (
            <div className={`badge-container position-absolute ${isDiscount ? 'is-discount' : ''}`}>
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

          <div className="product-info">
            {!isSoldOut && personalized && (
              <div className="product-cta-wrapper">
                <a
                  href={url}
                  onClick={onItemClick}
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
                  onClick={onAddToCartClick}
                  data-submit=""
                  className="btn btn-outline-darker btn-block fkt-cart-plus text-uppercase btn-cart kt-button btn-onclick add_to_cart_button addItemAjax gtm-grid-atc"
                  data-vrid={variantID}
                  data-pid={id}
                  data-product-id={id}
                >
                  <span className="text-nowrap addItemAjax-text text-capitalize">
                    {inCartQuantity > 0 ? `${inCartQuantity} in Cart` : 'Add to cart'}
                  </span>
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
              <div className="product-name">
                <a className="gtm-grid-product" onClick={onItemClick} data-product-id={id} href={url} tabIndex="0">
                  {title}
                </a>
              </div>
              <span className="product-price justify-content-start">
                <ins className={`ProductPrice-${id} font-weight-bold`} data-id={id}>
                  ${price}
                </ins>
                <del className={`ComparePrice-${id}`}>${comparePrice}</del>
                <span className="money-saved w-100">Save ${moneySaving}</span>
              </span>
              {unitCost && <span className="as-low-as">{`As low as $${unitCost} each`}</span>}
              {!!reviewsCount && (review || reviewsAverage) && (
                <ReviewStars id={id} href={url} count={reviewsCount} review={review} average={reviewsAverage} />
              )}
            </div>
          </div>
        </form>
      </div>
    </li>
  );
};

GridItem.propTypes = {
  index: PropTypes.number.isRequired,
  product: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired,
  discountBadge: PropTypes.array,
  mobileMode: PropTypes.bool.isRequired,
  inCartQuantity: PropTypes.number,
};

GridItem.defaultProps = {
  discountBadge: null,
  inCartQuantity: 0,
};

export default GridItem;
