import './StickyATC.scss';
import { addCart } from '@/service/CartAPI';

let currentVariant;

const generateATCBtn = ({ state, quantity, bisDate, price, type }) => {
  if (state !== 'sold-out' && type === 'Personalized') return '<span class="text-nowrap">Customize</span>';
  const btnATC = {
    available: `
      <i class="fkt-cart-plus"></i>
      <span class="text-nowrap">$${(price / 100).toFixed(2)}</span>
    `,
    'almost-gone': `
      <i class="fkt-cart-plus"></i>
      <span class="text-nowrap">$${(price / 100).toFixed(2)}</span>
      <small class="text-nowrap">(Only ${quantity} left in stock!)</small>
    `,
    'pre-order': `
      <span class="text-nowrap">Pre-order</span>
      <small class="text-nowrap">(Available on ${bisDate})</small>
    `,
    'sold-out': `
      <i class="icomoon-email"></i>
      <span class="text-nowrap">Notify Me</span>
    `,
  };
  return btnATC[state] ?? btnATC['sold-out'];
};

const updateVariant = (variantId, $root, variantsData, productData) => {
  currentVariant = variantId;
  const variant = variantsData.find(({ id }) => id === variantId);
  const { type, variants } = productData;
  const { price } = variants.find(({ id }) => id === variantId);
  const { state, quantity } = variant;
  const htmlATC = generateATCBtn({ ...variant, price, type });
  $root
    .find('.input-qty')
    .val(1)
    .attr('max', quantity)
    .end()
    .find('.quantity')
    .toggleClass('d-none', state === 'sold-out')
    .end()
    .find('.sticky_add_to_cart_button')
    .html(htmlATC);
};

const handleSubmit = ($root, variantsData, productData) => {
  const { state, bisDate } = variantsData.find(({ id }) => id === currentVariant);
  if (state === 'sold-out') {
    const image = $root.data('image');
    const variant = productData.variants.find(({ id }) => id === currentVariant);
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
    return;
  }
  if (productData.type === 'Personalized') {
    $('.yaya-personalizer-wrapper')[0].scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
    return;
  }
  const quantity = +$root.find('.input-qty').val();
  const $atc = $root.find('.sticky_add_to_cart_button').addClass('loading');
  const properties =
    state !== 'pre-order'
      ? ''
      : {
          'In Stock': `Preorder: Available on ${bisDate}`,
          date_diff: bisDate,
        };
  addCart([
    {
      id: currentVariant,
      quantity,
      properties,
    },
  ]).then(({ items }) => {
    const { EventEmitter, POPUP_ADDED_CART } = window.TW.main;
    EventEmitter.emit(POPUP_ADDED_CART, items[0]);
    $atc.removeClass('loading');
  });
};

const intersectionList = [];
const handleStickyTabsClick = ({ target }) => {
  const targetName = $(target).attr('href').substring(1);
  const targetData = intersectionList.find(({ name }) => name === targetName);
  const $target = targetData?.$target?.find('a.position-absolute');
  if ($target.length) {
    $target[0].scrollIntoView({
      behavior: 'smooth',
    });
  }
  return false;
};

const handleIntersection = (entries) => {
  $('#tw-sticky-tabs').find('.btn-text.active').removeClass('active');
  entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
    const targetName = $(target).data('in-view');
    const targetData = intersectionList.find(({ name }) => name === targetName);
    targetData.active = isIntersecting;
    targetData.ratio = intersectionRatio;
  });
  const [targetData] = intersectionList.sort((x, y) => y.ratio - x.ratio);
  if (targetData.active) targetData.$btn.addClass('active');
};

const initIntersections = () => {
  const $root = $('#tw-sticky-tabs');
  const $btns = $root.find('.btn-text');
  const options = {
    rootMargin: '-95px 0px -45px 0px',
    threshold: Array.from(Array(11)).map((e, i) => i * 0.1),
  };
  $btns.each((index, btn) => {
    const $btn = $(btn);
    const name = $btn.attr('href').substring(1);
    const $target = $(`[data-in-view="${name}"]`);
    intersectionList[index] = { name, $btn, $target, active: false, ratio: 0 };
    const observer = new IntersectionObserver(handleIntersection, options);
    observer.observe($target[0]);
    $btn.on('click', handleStickyTabsClick);
  });
};

let interval = -1;
export const init = ($emitter, productData, variantsData, defaultVariant) => {
  if (interval !== -1) clearTimeout(interval);
  const $root = $('#tw-sticky-atc');
  if (!$root.length) {
    interval = setTimeout(() => {
      init($emitter, productData, variantsData, defaultVariant);
    }, 500);
    return;
  }

  initIntersections();

  updateVariant(defaultVariant, $root, variantsData, productData);
  $emitter.on('updateVariant', ({ variant }) => {
    updateVariant(variant.id, $root, variantsData, productData);
  });

  $root.find('form.form').on('submit', (e) => {
    e.preventDefault();
    handleSubmit($root, variantsData, productData);
    return false;
  });
};
