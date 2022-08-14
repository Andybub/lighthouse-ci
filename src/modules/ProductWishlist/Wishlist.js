import './Wishlist.scss';

const observeWishlistStatus = ($bar, $btn) => {
  const observer = new MutationObserver(() => {
    $bar.toggleClass('is-added', $btn.hasClass('swym-added'));
  });

  observer.observe($btn[0], { attributes: true });
};

export const initQuickView = ($root, sectionId) => {
  const $bar = $root.find('.swym-button-bar.swym-wishlist-button-bar');
  const $btn = $root.find('.swym-btn-container>button');

  $root.on('updateVariant', ({ variant }) => {
    $btn.attr('data-variant-id', variant.id);
    // eslint-disable-next-line no-underscore-dangle
    window?._swat?.initializeActionButtons(`#ProductSection-${sectionId}`);
  });

  // eslint-disable-next-line no-underscore-dangle
  window?._swat?.initializeActionButtons(`#ProductSection-${sectionId}`);

  observeWishlistStatus($bar, $btn);

  $bar.on('click', (e) => {
    if ($(e.currentTarget).hasClass('is-added')) {
      e.preventDefault();
      e.stopPropagation();
      window.open('/pages/swym-wishlist', '_blank');
    }
  });
};

export const initProduct = ($root) => {
  const $bar = $root.find('.swym-button-bar.swym-wishlist-button-bar');
  const $btn = $root.find('.swym-btn-container>button');
  if (!$bar.length || !$btn.length) {
    setTimeout(() => {
      initProduct($root);
    }, 500);
    return;
  }

  observeWishlistStatus($bar, $btn);
};
