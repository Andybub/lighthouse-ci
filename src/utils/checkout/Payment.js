// payment rearrange, move apple-pay to 1st position
export const paymentRelocate = () => {
  const $payments = $('.dynamic-checkout__buttons .shopify-cleanslate li');
  if (!$payments.length) {
    setTimeout(paymentRelocate, 1250);
    return;
  }
  $payments.children('[data-testid="ApplePay-button"]').parent().addClass('apple-pay-button');
  $payments.children('[data-testid="ShopifyPay-button"]').parent().addClass('shopify-pay-button');
  $payments.children('[title="Checkout with PayPal"]').parent().addClass('pay-pal-button');
  $payments.parent().addClass('is-payment-rearranged');
};
