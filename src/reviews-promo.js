import './scss/reviews-promo.scss';

function initSwiper() {
  const { Swiper } = window;

  // eslint-disable-next-line no-unused-vars
  const reviewsSwiper = new Swiper('.reviews-swiper', {
    spaceBetween: 20,
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    slidesPerGroupAuto: true,
    watchSlidesProgress: true,
    loop: true,
    preloadImages: false,
    lazy: {
      enabled: true,
      checkInView: true,
      loadOnTransitionStart: true,
    },
  });
}

$(() => {
  initSwiper();

  $('.swiper-button-prev').on('click', (e) => {
    e.stopPropagation();
    const { swiper } =$(e.currentTarget).parent('.swiper-buttons').siblings('.swiper')[0];
    swiper.slidePrev();
  })

  $('.swiper-button-next').on('click', (e) => {
    e.stopPropagation();
    const { swiper } =$(e.currentTarget).parent('.swiper-buttons').siblings('.swiper')[0];
    swiper.slideNext();
  })
})
