import './scss/track-your-order.scss';

$(() => {
  const { settings } = JSON.parse(document.querySelector('#order-track-settings').textContent);
  // console.log('settings', settings);

  const $orderNumber = $('#shipment-tracker-order-number');
  const $email = $('#shipment-tracker-email');
  const $status = $('.shipment-status');
  const $loading = $('.order-loading-gif');

  $('.btn-submit').on('click', () => {
    if ($orderNumber.val().length !== 10 && $orderNumber.val().length !== 11) {
      $email.removeClass('onerror');
      $orderNumber.addClass('onerror');
      $status.find('span').text(settings.track_order_validation).addClass('onerror');
    } else if ($email.val().length === 0) {
      $email.addClass('onerror');
      $orderNumber.removeClass('onerror');
      $status.find('span').text(settings.track_order_validation).addClass('onerror');
    } else {
      $loading.show();
      $status.find('span').text(settings.track_order_processing).removeClass('onerror');
      $orderNumber.removeClass('onerror');
      $email.removeClass('onerror');

      $.ajax({
        url: 'https://mpvw5xxwk2.execute-api.us-east-2.amazonaws.com/v1/efmt/order/tracker',
        method: 'POST',
        dataType: 'json',
        data: {
          order_num: $orderNumber.val(),
          email: $email.val(),
        },
        success(data) {
          // console.log(data);
          if (data.status !== 'OK') {
            $loading.hide();
            $status.find('span').text(settings.track_order_error).addClass('onerror');
          } else {
            window.location.href = data.getOrderURL;
          }
        },
        error(error) {
          // console.warn(error);
          $status.find('span').text(settings.track_order_error).addClass('onerror');
          $loading.hide();
        },
      });
    }
  });
});
