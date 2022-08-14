import './FreePromotions.scss';

const THRESHOLD = 49;

const getEstimateDeliveryDate = () =>
  new Promise((resolve, reject) => {
    $.ajax('//tracker.efmt.app/v1/free_shipping_date')
      .done((data) => resolve(data))
      .fail((jqXHR, status, error) => {
        console.error('getEstimateDeliveryDate', status, error);
        reject(error);
      });
  });

const updateFreeShipping = ({ total_price: totalPrice }) => {
  const realTotalPrice = totalPrice / 100;
  const $freeShipping = $('.free-promotions .free-shipping');
  if (realTotalPrice < THRESHOLD) {
    $freeShipping.find('.icomoon-check').hide();
    const delta = (THRESHOLD - realTotalPrice).toFixed(2);
    $freeShipping.find('.status-2').show().find('.price-diff').text(`$${delta}`);
  } else {
    $freeShipping.find('.status-2').hide();
    $freeShipping.find('.icomoon-check').show();
  }
  const $deliveryDate = $freeShipping.find('.estimate-delivery>.delivery-date');
  if (!$deliveryDate.length) return;
  getEstimateDeliveryDate()
    .then(({ result, value }) => {
      if (!result || !value) return;
      $deliveryDate.text(value);
    })
    .catch((error) => console.log(error));
};

export const init = () => {
  const $root = $('.free-promotions');

  $root.find('.promotion-tab .promotion-tab-link').on('click', ({ currentTarget }) => {
    $(currentTarget).parents('.promotion-wrap').find('.promotion-popup').show();
  });

  $root.find('.promotion-popup').on('click', ({ target, currentTarget }) => {
    if ($(target).hasClass('promotion-popup-link')) return;
    $(currentTarget).hide();
  });

  const { EventEmitter, CART_LOADED, CART_ADDED, CART_UPDATED } = window.TW.main;
  EventEmitter.on(CART_LOADED, updateFreeShipping);
  EventEmitter.on(CART_ADDED, updateFreeShipping);
  EventEmitter.on(CART_UPDATED, updateFreeShipping);
};
