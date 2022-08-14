import './index.scss';
import { countdownDayOrTime } from '@/utils/Countdown';

function isScriptLoaded(url) {
  if (!url) return false;

  const scripts = document.getElementsByTagName('script');
  for (let i = scripts.length; i--;) {
      if (scripts[i].src.indexOf(url) !== -1) return true;
  }

  return false;
}

function loadScript(src, callback) {
  if (isScriptLoaded(src)) {
    callback()
  } else {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);

    script.addEventListener('load', () => {
      if(typeof callback === "function") callback();
    });
  }

}

const initSwiper = () => {
  const {
    loop = 'true',
    autoplay = 'true',
    delay = 7,
    slidesPerView = 1,
    spaceBetween = 0,
    speed = 400,
  } = document.getElementById('home-banner-swiper').dataset;

  const config = {
    loop: loop === 'true',
    autoplay: autoplay === 'true'
      ? {
        delay: Number(delay) * 1000,
      }
      : false,
    slidesPerView: Number(slidesPerView),
    spaceBetween: Number(spaceBetween),
    speed: Number(speed),
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
  };

  const { Swiper } = window;
  // eslint-disable-next-line no-unused-vars
  const homeBannerSwiper = new Swiper('#home-banner-swiper', config);
}

$(() => {
  loadScript(`${window.TW.assetPath}swiper.min.js`, () => {
    initSwiper();
  })

  const $section = $('.tw-slideshow-section');
  // count-down
  const $countDownContainer = $section.find('.count-down-container');
  const contentEnd = parseInt($countDownContainer.attr('data-end-time'), 10);
  let time = countdownDayOrTime(contentEnd);
  if (time !== '') {
    $countDownContainer.show();
    const $countDown = $countDownContainer.find('.countdown-clock');
    const countDown = () => {
      time = countdownDayOrTime(contentEnd);
      if (time.includes(':')) {
        // in 1 day
        const [h, m, s] = time.split(':');
        $countDown.text(`${h} Hours ${m} Minutes ${s} Seconds`);
      } else {
        // over 1 day
        $countDown.text(time);
      }
    };
    countDown();
    setInterval(() => {
      countDown();
    }, 1000);
  }
});