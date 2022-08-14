import './Customizer.scss';
import { addCart } from '@/service/CartAPI';

let variantId = 0;
let variantState = '';
let reactObserver = null;
let customizerState = null;
let rushTimeState = null;

const initCustomizerState = (reset = false) => {
  if (customizerState && !reset) return true;
  const data = window.TW?.product?.CustomizerData;
  if (!data) {
    customizerState = null;
    return false;
  }
  const { stepData } = data;
  customizerState = {
    data: stepData,
    customized: [],
  };
  console.log({ customizerState });
  return true;
};

const updateRushTime = (text, cost = 0) => {
  if (!text && !cost) {
    rushTimeState = null;
    return;
  }
  rushTimeState = [
    cost,
    {
      _production_cost_quantity: cost,
      'Personalized Rush Production Time': `$${cost.toFixed(2)}`,
      'Production Time': text,
    },
  ];
};

const checkStates = () => {
  if (!rushTimeState || !customizerState) return false;
  const { customized, data: source } = customizerState;
  if (customized.length !== source.length) return false;
  return customized.every(({ data }) => {
    if (typeof data === 'string') return !!data;
    return !!data?.name;
  });
};

const handleSubmit = (quantity) => {
  const [rushCost, propsRushTime] = rushTimeState;
  const { customized } = customizerState;
  console.log('handleSubmit', { rushCost, propsRushTime, customized });
  const properties = customized.reduce((result, customizedData) => {
    const { title, data } = customizedData;
    return {
      ...result,
      [title]: data?.name ?? data,
    };
  }, propsRushTime);
  return addCart([
    { id: variantId, quantity, properties },
    {
      id: 39308598083630,
      quantity: quantity * rushCost,
    },
  ]);
};

const handleMobileMutations = () => {
  const $block = $('.step-controls-container');
  if (!$block.length || !initCustomizerState()) return;
  const { data } = customizerState;
  const stepTitle = $block
    .find('.step-controls-title')
    .text()
    .split(/\d\/\d /)[1];
  const stepIndex = data.findIndex(({ title }) => title === stepTitle);
  console.log({ stepTitle, stepIndex });
  if (stepIndex < 0) {
    if (stepTitle === 'Choose Production Time') {
      const $select = $block.find('select');
      $select.on('change', () => {
        if (!$select.val()) {
          updateRushTime();
          return;
        }
        const optionText = $select.find('option:selected').text();
        const [rushText, otherText] = optionText.split('(+$');
        if (!otherText) updateRushTime(rushText.trim());
        else {
          const rushCost = +otherText.trim().split('.00)')[0];
          updateRushTime(rushText.trim(), rushCost);
        }
      });
    }
  } else {
    const { type: stepType } = data[stepIndex];
    if (stepType === 'text') {
      const inputValue = $block.find('input').val();
      customizerState.customized[stepIndex] = {
        ...data[stepIndex],
        data: inputValue,
      };
    } else {
      const $selected = $block.find('li.selected');
      if (!$selected.length) return;
      const selectedIndex = $block.find('li').index($selected);
      const value = data[stepIndex].data[selectedIndex];
      customizerState.customized[stepIndex] = {
        ...data[stepIndex],
        data: value,
      };
    }
  }
};

const handleDesktopMutations = () => {
  const $form = $('#cart-form--product-template');
  const $blocks = $('.personalizer-accordion-item');
  if ($blocks.length && $form.hasClass('prevent-children')) {
    $form.removeClass('prevent-children');
    $('.product-customizer-select-wrap>select').val('');
  }
  const $block = $('.personalizer-accordion-item.open');
  if (!$block.length || !initCustomizerState()) return;
  const { data } = customizerState;
  const blockTitle = $block.find('.accordion-label>label').text();
  const blockIndex = data.findIndex(({ title }) => title === blockTitle);
  const { type: blockType } = data.find(({ title }) => title === blockTitle);
  if (blockType === 'text') {
    const inputValue = $block.find('input').val();
    customizerState.customized[blockIndex] = {
      ...data[blockIndex],
      data: inputValue,
    };
  } else {
    const $selected = $block.find('li.selected');
    const selectedIndex = $block.find('li').index($selected);
    const value = data[blockIndex].data[selectedIndex];
    customizerState.customized[blockIndex] = {
      ...data[blockIndex],
      data: value,
    };
  }
};

const handleMatchMedia = (isMobile) => {
  if (reactObserver) reactObserver.disconnect();
  initCustomizerState(true);
  if (isMobile) {
    const $mobile = $('.product-customizer-options').next('.personalizer-mobile-portal');
    if (!$mobile.length) {
      setTimeout(() => handleMatchMedia(isMobile), 500);
      return;
    }
    if (variantState === 'sold-out') {
      $('.cart.product-form').css('height', 'auto');
      return;
    }
    $('.btn.personalize-it-btn').addClass('d-block');
    $mobile.on('click', '.personalizer-add-to-cart', ({ target }) => {
      if (!checkStates()) return;
      $(target).addClass('is-loading');
      handleSubmit()
        .then((result) => {
          console.log(result);
          window.location.href = '/cart';
        })
        .catch((err) => console.error(err))
        .finally(() => {
          $(target).removeClass('is-loading');
        });
    });
    reactObserver = new MutationObserver(handleMobileMutations);
    reactObserver.observe($mobile[0], { subtree: true, childList: true, attributes: true });
  } else {
    const $desktop = $('.yaya-personalizer-wrapper');
    reactObserver = new MutationObserver(handleDesktopMutations);
    reactObserver.observe($desktop[0], { subtree: true, childList: true, attributes: true });
  }
};

const initPersonalizer = () => {
  const mql = window.matchMedia('(max-width: 767px)');
  mql.addEventListener('change', ({ matches }) => handleMatchMedia(matches));
  handleMatchMedia(mql.matches);
};

const initRushTime = () => {
  const $root = $('.product-customizer-options');
  const $toggle = $root.find('.pco__item-label');
  const $select = $root.find('#ProductionTime');
  const $rushText = $root.find('input#ShowRushCost');
  const $rushCost = $root.find('input#ProductionCost');
  $toggle.on('click', () => {
    $toggle.toggleClass('closed');
  });
  $select.on('change', () => {
    if (!$select.val()) {
      updateRushTime();
      return;
    }
    const cost = +$select.children('option:selected').data('prod-time-cost');
    const costText = `$${cost.toFixed(2)}`;
    $rushText.val(costText);
    $rushCost.val(cost);
    $('.product-customizer-customizations-total>span').text(costText);
    updateRushTime($select.val(), cost);
  });
};

export const init = (data) => {
  [{ id: variantId, state: variantState }] = data;

  initRushTime();
  initPersonalizer();

  $('form[action="/cart/add"').on('submit', (e) => {
    if (!checkStates()) {
      e.preventDefault();
      return false;
    }
    const quantity = $(e.target).find('input[name="quantity"]').val();
    $('button[name="add"]').addClass('loading');
    handleSubmit(quantity)
      .then((result) => {
        console.log(result);
        window.location.href = '/cart';
      })
      .catch((err) => console.error(err))
      .finally(() => {
        $('button[name="add"]').removeClass('loading');
      });
    return false;
  });
};
