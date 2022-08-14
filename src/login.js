import '@/scss/login.scss';
import { initShippingRate } from './utils/checkout/ShippingRate';

function backToTop() {
  if (window.pageYOffset > 0) {
  window.scrollBy(0, -10);
  setTimeout(backToTop, 0);
  }
}

function initPage() {
  const { hash = '' } = window.location;

  console.log('hash', hash);

  if (hash === '#recover') {
    $('.change-password-wrapper').addClass('active');
  } else {
    $('.login-wrapper').addClass('active');
  }
}

function redirectTo(formID, path) {
  const form = document.querySelectorAll(formID)[0];

  if (form) {
    const redirect = document.createElement('input');
    redirect.setAttribute('name', 'return_to');
    redirect.setAttribute('type', 'hidden');
    redirect.value = path;
    form.appendChild(redirect);
  }
}


if (window.jQuery) {
  initPage();

  redirectTo('#ChangePasswordForm', '/account/logout');

  $('.btn-login-footer').on('click', (e) => {
    $('[data-show]').addClass('hide');

    const { type } = e.target.dataset;
    if (type === 'create account') {
      $('[data-show*=create]').removeClass('hide');
    } else if (type === 'login') {
      $('[data-show*=login]').removeClass('hide');
    }

    backToTop();
  })

  $('.btn-hint').on('click', (e) => {
    $('[data-show]').addClass('hide');

    const { type } = e.target.dataset;
    if (type === 'forgot password') {
      $('[data-show*=forgot]').removeClass('hide');
      $('.login-footer [data-show*=login]').removeClass('hide');
    } else if (type === 'cancel') {
      $('[data-show*=login]').removeClass('hide');
    }
  })
}

