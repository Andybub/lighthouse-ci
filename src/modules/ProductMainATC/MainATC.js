import './MainATC.scss';

let currentVariant;

const updateAddToCartText = (state, $root, sectionId) => {
  const { addToCart, preOrder, soldOut } = window.theme.strings;
  let text;
  switch (state) {
    case 'pre-order':
      text = preOrder;
      break;
    case 'sold-out':
      text = soldOut;
      break;
    default:
      text = addToCart;
  }
  $root.find(`#AddToCartText-${sectionId}`).text(text);
};

const updateAddToCartBtns = (state, $root, sectionId) => {
  const $addToCart = $root.find(`#AddToCart-${sectionId}`);
  const $notifyMe = $root.find(`#NotifyMe-${sectionId}`);
  if (state === 'sold-out') {
    $addToCart.prop('disabled', true);
    $notifyMe
      .removeClass('btn-outline-primary')
      .addClass('btn-primary')
      .children('span')
      .text('Notify me when available')
      .end()
      .show();
  } else if (state === 'pre-order') {
    $addToCart.prop('disabled', false);
    $notifyMe
      .removeClass('btn-primary')
      .addClass('btn-outline-primary')
      .children('span')
      .text('Notify me')
      .end()
      .show();
  } else {
    $addToCart.prop('disabled', false);
    $notifyMe.hide();
  }
};

const updateInStockMessage = (variant, $root) => {
  const { state, quantity, bisDate } = variant;
  const $msg = $root.find('.add-to-cart-message > p').html('').hide();
  if (state === 'almost-gone') {
    $msg.filter('.msg-almost-gone').text(`Only ${quantity} left in stock!`).show();
  } else if (state === 'pre-order') {
    $msg.filter('.msg-pre-order').html(`Preorders will ship on <b>${bisDate}</b>`).show();
  }
};

const updateHiddenInput = (variant, $root) => {
  const { state, bisDate } = variant;
  $root.find('.hidden-input').remove();
  if (state !== 'pre-order') return;
  $('<input />')
    .attr('type', 'hidden')
    .addClass('hidden-input')
    .attr('name', 'properties[In Stock]')
    .val(`Preorder: Available on ${bisDate}`)
    .appendTo($root);
  $('<input />')
    .attr('type', 'hidden')
    .addClass('hidden-input')
    .attr('name', 'properties[date_diff]')
    .val(bisDate)
    .appendTo($root);
};

const updateVariant = (variant, $root, sectionId) => {
  console.log('updateVariant', variant);
  updateAddToCartText(variant.state, $root, sectionId);
  updateAddToCartBtns(variant.state, $root, sectionId);
  updateInStockMessage(variant, $root);
  updateHiddenInput(variant, $root);
  currentVariant = variant.id;
};

const handleNotifyMe = ({ currentTarget, data: productData }) => {
  const image = $(currentTarget).data('image');
  const variant = productData.variants.find(({ id }) => id === currentVariant);
  console.log('handleNotifyMe', currentVariant, productData.variants);
  const { EventEmitter, POPUP_KLAVIYO_BIS } = window.TW.main;
  const { customerEmail } = document.getElementById('tw-main-script').dataset;
  EventEmitter.emit(POPUP_KLAVIYO_BIS, {
    image,
    productId: productData.id,
    variantId: variant.id,
    title: variant.name,
    price: variant.price,
    regularPrice: variant.compare_at_price,
    customerEmail,
  });
};

export const init = ($root, sectionId, productData, variantsData, defaultVariant) => {
  currentVariant = defaultVariant;
  $root
    .on('updateVariant', ({ variant }) => {
      const target = variantsData.find(({ id }) => id === variant.id);
      if (target) updateVariant(target, $root, sectionId);
    })
    .on('click', '.btn-klaviyo-bis-trigger', productData, handleNotifyMe);
};
