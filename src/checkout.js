import './scss/checkout.scss';
import { fixShippingAddressInput } from '@/utils/checkout/CheckForm';
import { paymentRelocate } from '@/utils/checkout/Payment';
import { initComm100API } from '@/modules/Comm100';
import { fixPersonalizedProductsText } from './utils/checkout/Personalized';
import { fixPreOrderDateText } from './utils/checkout/PreOrder';
import { initFastSimon } from './utils/checkout/FastSimon';
import { initContactUs } from './utils/checkout/ContactUs';
import { initShippingRate } from './utils/checkout/ShippingRate';

// add lock icon
const addLockIcon = () => {
  const btnContinueButton = document.querySelector('#continue_button');
  if (btnContinueButton) {
    const btnContentLock = btnContinueButton.querySelector('.btn-content-lock');
    if (!btnContentLock) {
      const btnContent = btnContinueButton.querySelector('.btn__content');
      const txt = btnContent.textContent;
      btnContent.style = 'display: none;';
      const i = document.createElement('i');
      i.classList.add('icomoon-lock');
      const span = document.createElement('span');
      span.classList.add('btn-content-lock');
      span.textContent = txt;
      span.appendChild(i);
      btnContinueButton.insertBefore(span, null);
    }
  }
};

// TODO test fix taxes
const fixTaxes = () => {
  if ($('.payment-due-label__taxes [data-checkout-total-taxes-target]').length) {
    const taxesRaw = parseInt(
      $('.payment-due-label__taxes [data-checkout-total-taxes-target]').attr('data-checkout-total-taxes-target'),
      10,
    );
    const taxesFormat = (taxesRaw / 100).toFixed(2);
    $('.payment-due-label__taxes').html(`Tax savings of $${taxesFormat}`);
  }
};

// Flexible Returns 180 Days
const flexibleReturnsRelocate = () => {
  const parentElement = document.querySelector('.order-summary__sections');
  if (parentElement) {
    if (!parentElement.querySelector('.flexible-returns-container')) {
      const returnElement = document.querySelector('.flexible-returns-container');
      returnElement.style.display = 'block';
      parentElement.appendChild(returnElement, null);
    }
  }
};

const cabRearrange = () => {
  const parent = $('.order-summary__sections');
  const cab = $('.recommended-container');
  if (parent.find(cab).length < 1) {
    initFastSimon('.recommended-container');
    parent.append(cab);
  }
};

const fixSafari = () => {
  $('.grid-item .product-body .product-name a').css('-webkit-line-clamp', '3');
  setTimeout(() => {
    $('.grid-item .product-body .product-name a').css('-webkit-line-clamp', '2');
  }, 50);
};

(($) => {
  // window.$ = $;
  /* 
  The page:load event is triggered when the content of each step is loaded. 
  This is the default event that you should use when adding content into the page on load.
  */
  $(document).on('page:load', () => {
    // console.log('page:load!');
  });

  /* 
  The page:change event is triggered when the customer is on the same checkout step, 
  but part of the content has changed. 
  For example, this event triggers when the discount form is submitted.
  If you add content to the Document Object Model (DOM) with only page:load, 
  then there’s a risk that it could be overwritten by a page:change event. 
  To avoid this issue, you should watch for both events when adding content.
  (ex: Apply Discount)
  */
  $(document).on('page:load page:change', () => {
    // console.log('page:load page:change!');
    // do at every step
    fixTaxes();
    flexibleReturnsRelocate();
    fixPersonalizedProductsText();
    fixPreOrderDateText();
    // cabRearrange();

    const { page, step } = window.Shopify.Checkout;
    // console.log('page', page);
    // console.log('step', step);
    if (step === 'contact_information') {
      paymentRelocate();
      fixShippingAddressInput();
    } else if (step === 'shipping_method') {
      initShippingRate();
    } else if (step === 'payment_method') {
      addLockIcon();
    } else if (step === 'processing') {
      //
    } else if (step === 'review') {
      //
    } else if (step === 'thank_you' || window.Shopify.Checkout.isOrderStatusPage) {
      initContactUs();
      initComm100API({ onlyDesktop: false });
      cabRearrange();
      if (document.querySelector('html').classList.contains('safari')) {
        $(document).on('click', 'button.order-summary-toggle.order-summary-toggle--show', () => {
          fixSafari();
        });
      }
    } else {
      //
    }
  });

  const $survey = $('#tw-purchase-survey');
  if (Shopify.Checkout.step && Shopify.Checkout.step === 'thank_you') {
    $survey
      .on('click', (e) => {
        const { target, currentTarget } = e;
        if (target === currentTarget) $survey.removeAttr('style');
      })
      .find('.icomoon-close')
      .on('click', () => {
        $survey.removeAttr('style');
      });
  } else if ($survey.length) $survey.remove();
})(window.Checkout.$);
