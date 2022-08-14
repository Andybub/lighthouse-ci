import './KlaviyoSubscribe.scss';
import { isValidEmail } from '@/utils/Validator';
import { sendSubscribe } from '@/service/KlaviyoAPI';

let $form = null;

const resetMessages = () => {
  $form
    .find('.form-control')
    .removeClass('is-invalid')
    .next('.icomoon-danger')
    .addClass('d-none')
    .end()
    .end()
    .find('.error-message')
    .addClass('d-none')
    .text('')
    .end()
    .prev('.klaviyo-messages')
    .addClass('d-none');
};

const handleError = (msg) => {
  $form
    .find('.form-control')
    .addClass('is-invalid')
    .next('.icomoon-danger')
    .removeClass('d-none')
    .end()
    .end()
    .find('.error-message')
    .text(msg)
    .removeClass('d-none');
};

const handleSuccess = () => {
  $form.find('.form-control').blur().end().prev('.klaviyo-messages').removeClass('d-none');
};

const handleSubmit = () => {
  resetMessages();
  const email = $form.find('#k_id_email').val();
  if (!email || !isValidEmail(email)) {
    handleError('Please enter a valid email address.');
    return;
  }
  sendSubscribe(email)
    .then(({ message }) => {
      if (message === 'OK') handleSuccess();
      else handleError(message);
    })
    .catch((err) => {
      console.error(err);
      handleError(err);
    });
};

export const initKlaviyoSubscribe = () => {
  $form = $('#klaviyo-subscribe-form');
  if (!$form.length) return;
  $form
    .on('submit', (e) => {
      e.preventDefault();
      handleSubmit();
    })
    .find('#k_id_email')
    .on('focus', () => {
      resetMessages();
    });
};
