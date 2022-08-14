import './DiscountHandler.scss';
import { getBadge } from '@/utils/DiscountBadge';
import { countdownTimeOnly } from '@/utils/Countdown';

export const initDiscountBadge = ($root, { tags }) => {
  const badge = getBadge()?.find(({ tag }) => tags.includes(tag));
  if (badge) {
    const $badge = $('<div class="discount-badge"></div>').append(`<img src="${badge.image}" alt="${badge.tag}" />`);
    $root.find('#ProductPhoto').prepend($badge);
  }
};

export const initDiscountBanner = ($root, collections) => {
  if (!window.TW.DiscountBanner) return;

  const {
    discountType,
    discountCode,
    mobileMessageText,
    specificCollection1,
    specificCollection2,
    specificCollection3,
    specificCollection4,
    specificCollection5,
    endHeader,
  } = window.TW.DiscountBanner;

  const index = [
    specificCollection1,
    specificCollection2,
    specificCollection3,
    specificCollection4,
    specificCollection5,
  ].findIndex((text) => collections.map(({ handle }) => handle).includes(text));

  if (index > -1 && discountType === 'weekly') {
    const $banner = $root.find('.product-discount-banner');
    $banner.find('.message').text(mobileMessageText);
    $banner.find('.code').text(discountCode);
    const time = countdownTimeOnly(endHeader, 1);
    if (time !== '') {
      const $countdown = $banner.find('.count-down');
      setInterval(() => {
        $countdown.text(countdownTimeOnly(endHeader));
      }, 1000);
      $countdown.text(countdownTimeOnly(endHeader)).addClass('d-block');
    }
    $banner.removeClass('d-none').addClass('d-flex');
  }
};

export const initDiscountPrice = ($root, collections) => {
  if (!window.TW.DiscountBanner) return;

  const {
    discountType,
    specificCollection1,
    specificCollection2,
    specificCollection3,
    specificCollection4,
    specificCollection5,
  } = window.TW.DiscountBanner;

  const index = [
    specificCollection1,
    specificCollection2,
    specificCollection3,
    specificCollection4,
    specificCollection5,
  ].findIndex((text) => collections.map(({ handle }) => handle).includes(text));

  if (discountType === 'sitewide' || (index > -1 && discountType === 'weekly')) {
    $root.find('.price-wrapper .entry-price [class^="ProductPrice-"]').addClass('discount');
  }
};
