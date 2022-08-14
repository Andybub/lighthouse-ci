import './Item.scss';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { getInventoryType } from '@/react/utils/inventory';

const Item = (props) => {
  const { item, onIncreaseQuantity, onDecreaseQuantity, onUpdateQuantity, onRemoveItem } = props;

  const itemImage = item.image ? item.image.replace('.jpg', '_medium.jpg') : '';

  const inventoryType = getInventoryType(
    item.variant_inventory_quantity,
    item.variant_inventory_policy,
    item.variant_threshold,
    item.variant_sold_out,
    item.unavailable,
  );

  const preOrderMessage = inventoryType === 'preOrder' ? `${item.variant_sold_out.replace('Preorder: Available on', '')}` : '';
  const almostGoneMessage =
    inventoryType === 'almostGone' && item.variant_sold_out && item.variant_sold_out.includes('Sold Out until')
      ? `More coming on ${item.variant_sold_out}`
      : '';
  const isPersonalized = item.product_type === 'Personalized';
  const isDiscount = item.line_level_discount_allocations && item.line_level_discount_allocations.length > 0;
  let finalLinePrice = (item.final_line_price / 100).toFixed(2);
  let eachPrice = (item.final_line_price / item.quantity / 100).toFixed(2);
  if (isPersonalized) {
    const productionCost = parseInt(item.properties._production_cost_quantity, 10) * item.quantity * 100;
    finalLinePrice = ((item.final_line_price + productionCost) / 100).toFixed(2);
    eachPrice = ((item.final_line_price + productionCost) / item.quantity / 100).toFixed(2);
  }
  const originalEachPrice = isDiscount ? `${(item.original_price / 100).toFixed(2)}` : '';

  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(String(item.quantity));

  useEffect(() => {
    setLoading(false);
    setQuantity(String(item.quantity));
  }, [item]);

  const adjustHandle = useCallback(
    (e) => {
      e.preventDefault();
      const { dataset } = e.target;
      const { lineItemKey, action } = dataset;
      if (!loading) {
        setLoading(true);
        if (action === 'plus') {
          onIncreaseQuantity({ lineItemKey });
        } else {
          onDecreaseQuantity({ lineItemKey });
        }
      }
    },
    [item, loading],
  );

  const changeHandle = useCallback(
    (e) => {
      e.preventDefault();
      const { _reactName: eventName } = e;
      const { dataset } = e.target;
      const { lineItemKey } = dataset;
      const newQuantity = e.target.value;
      if (!loading) {
        if (eventName === 'onChange') {
          setQuantity(newQuantity);
        } else if (eventName === 'onBlur') {
          if (Number.isNaN(parseInt(newQuantity, 10)) || parseInt(newQuantity, 10) < 1) {
            setQuantity(e.target.defaultValue);
          } else {
            setLoading(true);
            onUpdateQuantity({ lineItemKey, quantity: parseInt(newQuantity, 10) });
          }
        }
      }
    },
    [loading],
  );

  const onKeyUp = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        const { dataset } = e.target;
        const { lineItemKey } = dataset;
        const newQuantity = e.target.value;
        if (!loading) {
          if (Number.isNaN(parseInt(newQuantity, 10)) || parseInt(newQuantity, 10) < 1) {
            setQuantity(item.quantity);
          } else {
            setLoading(true);
            onUpdateQuantity({ lineItemKey, quantity: parseInt(newQuantity, 10) });
          }
        }
      }
    },
    [loading],
  );

  const onKeyDown = useCallback((e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }, []);

  const addToWishlistHandle = useCallback(
    (e) => {
      e.preventDefault();
      const { dataset } = e.target;
      const { lineItemKey, dt, epi, du, empi, iu, op, pr } = dataset;
      window._swat.addToWishList(
        {
          dt,
          epi,
          du,
          empi,
          iu,
          op: (op / 100).toFixed(2),
          pr: (pr / 100).toFixed(2),
        },
        () => {
          onRemoveItem({ lineItemKey });
        },
      );
    },
    [loading],
  );

  const removeHandle = useCallback(
    (e) => {
      e.preventDefault();
      const { dataset } = e.target;
      const { lineItemKey } = dataset;
      if (!loading) {
        setLoading(true);
        onRemoveItem({ lineItemKey });
      }
    },
    [loading],
  );

  return (
    <div
      className={`item col-12 ${item.product_id === 6552844959790 ? 'd-none prevent-children' : ''}`}
      data-loading={loading}
      data-line-item-key={item.key}
      data-inventory-type={inventoryType}
    >
      <div className="row pt-5 pb-4">
        <div className="item-top-container col-12 col-md-8 col-lg-8 row">
          <a className="gtm-cart-product item-image-container col-4 col-md-3" data-product-id={item.product_id} href={item.url} target="_self">
            <img className="item-image img-fluid lazyload" data-src={itemImage} alt="" />
            {inventoryType === 'preOrder' && (
              <img
                className="badge-pre-order position-absolute"
                src={`${window.TW.assetPath}badge_pre_order.svg`}
                alt="Pre order"
              />
            )}
            {inventoryType === 'almostGone' && (
              <img
                className="badge-almost-gone position-absolute"
                src={`${window.TW.assetPath}badge_almost_gone.svg`}
                alt="almost gone"
              />
            )}
          </a>
          <div className="item-info-container col-8 col-md-9">
            <a className="gtm-cart-product" data-product-id={item.product_id} href={item.url}>
              <p className="item-title">{item.title}</p>
            </a>
            {item.variant_title && !item.variant_title.includes('Default') && (
              <p className="item-sub-title">{item.variant_title}</p>
            )}
            {isDiscount &&
              item.line_level_discount_allocations &&
              item.line_level_discount_allocations.map((discount) => (
                <p className="prompt-discount" key={discount.discount_application.key}>{`${
                  discount.discount_application.title
                } (-$${(discount.amount / item.quantity / 100).toFixed(2)}/ea)`}</p>
              ))}
            {isPersonalized &&
              Object.entries(item.properties).map(([first, last]) => {
                if (first === '_production_cost_quantity') {
                  return <p key={first} className="prompt-customize-prop d-none">{`${first}: ${last}`}</p>;
                }
                return (
                  <p key={first} className="prompt-customize-prop">{`${first
                    .replace('Choose ', '')
                    .replace('Enter ', '')}: ${last}`}</p>
                );
              })}
            {inventoryType === 'soldOut' && <p className="prompt-sold-out">Sold out</p>}
            {inventoryType === 'preOrder' && <p className="prompt-available-date">{`Available on ${preOrderMessage}`}</p>}
            {inventoryType === 'almostGone' && (
              <p className="prompt-almost-gone">{`Only ${item.variant_inventory_quantity} left in stock! ${almostGoneMessage}`}</p>
            )}
          </div>
        </div>
        <div className="item-bottom-container col-12 col-md-4 col-lg-4 row">
          <div className="col-8 col-md-12 col-lg-12">
            <div className="row">
              <div className="control-container col-6 d-flex align-items-center">
                <button
                  onClick={adjustHandle}
                  type="button"
                  className="btn-quantity-minus js-qty__adjust border-right-0 prevent-children"
                  data-line-item-key={item.key}
                  data-action="minus"
                  disabled={item.quantity < 2}
                >
                  −
                </button>
                <input
                  type="text"
                  className="input-quantity js-qty__num w-100 text-center border-top border-bottom border-left-0 border-right-0 rounded-0"
                  id={`updates_${item.key}`}
                  onChange={changeHandle}
                  onBlur={changeHandle}
                  onKeyUp={onKeyUp}
                  onKeyDown={onKeyDown}
                  value={quantity}
                  min="1"
                  data-line-item-key={item.key}
                  aria-label="quantity"
                  pattern="[0-9]*"
                  name="updates[]"
                />
                <button
                  onClick={adjustHandle}
                  type="button"
                  className="btn-quantity-plus js-qty__adjust border-left-0 prevent-children"
                  data-line-item-key={item.key}
                  data-action="plus"
                >
                  +
                </button>
              </div>
              <div className="price-container col-6">
                <p className="txt-final-line-price">{`$${finalLinePrice}`}</p>
                {isDiscount ? (
                  <p className="txt-each-price">
                    <span className="original-each-price">{`$${originalEachPrice}/ea`}</span>
                    <span className="discount-each-price">{`$${eachPrice}/ea`}</span>
                  </p>
                ) : (
                  <p className="txt-each-price">
                    <span>{`$${eachPrice}/ea`}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="col-4 col-md-12 col-lg-12 d-flex justify-content-end align-items-end pr-0">
            <button
              onClick={addToWishlistHandle}
              className="gtm-atw btn-move-to-wishlist border-0 bg-transparent prevent-children"
              type="button"
              data-line-item-key={item.key}
              data-dt={item.title}
              data-epi={item.variant_id}
              data-empi={item.product_id}
              data-iu={item.image}
              data-op={item.original_price}
              data-pr={item.price}
              data-du={`${window.Shopify.shop_url + item.url}`}
              data-product-id={item.product_id}
            >
              <i className="icomoon icomoon-move-to-wishlist" />
            </button>
            <button
              onClick={removeHandle}
              className="gtm-cart-remove btn-remove-from-cart cart__remove border-0 bg-transparent prevent-children"
              type="button"
              data-line-item-key={item.key}
              data-product-id={item.product_id}
            >
              <i className="icomoon icomoon-remove" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Item.propTypes = {
  item: PropTypes.object.isRequired,
  onIncreaseQuantity: PropTypes.func.isRequired,
  onDecreaseQuantity: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};

Item.defaultProps = {};

export default Item;
