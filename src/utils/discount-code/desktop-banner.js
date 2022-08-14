import { countdownTimeOnly } from "../../utils/countdown";

export const initDesktopBanner = () => {
  console.log('===== initDesktopBanner =====');

  const { DISCOUNT } = window.TW;
  console.log('DISCOUNT', DISCOUNT);
  if (!DISCOUNT) return;

  const { endHeader, discount_type } = DISCOUNT;
  const countdown = countdownTimeOnly(endHeader, 1);
  console.log(discount_type, countdown);
  if (!countdown || discount_type !== 'sitewide') return;

  const $desktopBanner = $('.wrapper.medium-down--hide.header-bar-top');
  console.log('$desktopBanner', $desktopBanner);
  if (!$desktopBanner.size()) return;

  const $countdown = $desktopBanner.find('.countdown').text(` | Ends ${countdown}`).show();
  console.log('$countdown', $countdown);
  const interval = setInterval(() => {
    const countdown2 = countdownTimeOnly(endHeader, 1);
    if (!countdown2) {
      $countdown.text('').hide();
      clearInterval(interval);
      return;
    }
    $countdown.text(` | Ends ${countdown2}`);
  }, 1000);
};
