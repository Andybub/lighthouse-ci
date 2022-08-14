export const initShippingRate = () => {
  const cbbData = localStorage.getItem('cbb-shipping-rates-calculator-shipping-rate-object');
  if (cbbData) {
    const { id, amount } = JSON.parse(cbbData).value;
    const $target = $(`.content-box[data-shipping-methods] .radio-wrapper:eq(${id.split('-').pop()})`);
    const value = $target.attr('data-shipping-method').split('-').pop();
    if (amount === value) $target.find('input.input-radio').prop('checked', true);
  }
};
