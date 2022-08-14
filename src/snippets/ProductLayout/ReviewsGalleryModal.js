import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';
import './ReviewsGalleryModal.scss';

const handleModalOpen = () => {
  const $modal = $('#tw-reviews-gallery-modal').addClass('show').show();
  disableBodyScroll($modal[0]);
};

const handleModalClose = () => {
  const $modal = $('#tw-reviews-gallery-modal').removeClass('show').hide();
  enableBodyScroll($modal[0]);
};

const addToggleButton = () => {
  const $root = $('#stamped-main-widget');
  $('<div id="tw-reviews-gallery-btn">view all images</div>')
    .appendTo($root.find('.stamped-summary-photos'))
    .on('click', () => handleModalOpen());
  const $modal = $('#tw-reviews-gallery-modal');
  $modal
    .on('click', ({ target, currentTarget }) => {
      if (target === currentTarget) handleModalClose();
    })
    .on('click', '.close', () => handleModalClose());
};

const handleMutation = (mutations, observer) => {
  observer.disconnect();
  addToggleButton();
};

export const init = () => {
  const widget = document.getElementById('stamped-reviews-widget');
  const observer = new MutationObserver(handleMutation);
  observer.observe(widget, {
    childList: true,
    subtree: true,
  });
};
