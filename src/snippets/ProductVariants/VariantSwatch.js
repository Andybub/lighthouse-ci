import './VariantSwatch.scss';

const setHoverText = ($hover, group, text) => {
  let targetText = text;
  if (group === 'size' && text.includes('/')) {
    targetText = text.split('/').map((str, index) => {
      if (!index) return str;
      return str.substring(1, 0).toUpperCase() + str.substring(1);
    }).join('/');
  }
  $hover.html(targetText);
};

const initVariantSwatch = group => {
  const $wrap = $(`.variant-container.variant-${group}-container`);
  if (!$wrap.length) return;

  const $items = $wrap.find(`.li-${group}`);
  const $hover = $wrap.find(`.${group}-hover`);
  if (!$items.length || !$hover.length) return;

  const defaultValue = $items.filter('.selected').attr(`data-${group}`);
  setHoverText($hover, group, defaultValue);

  $items.on('mouseenter', ({ currentTarget }) => {
    const hoverValue = $(currentTarget).attr(`data-${group}`);
    setHoverText($hover, group, hoverValue);
  }).on('mouseleave' , () => {
    setHoverText($hover, group, defaultValue);
  });
};

export const init = () => {
  initVariantSwatch('color');
  initVariantSwatch('style');
  initVariantSwatch('size');
};
