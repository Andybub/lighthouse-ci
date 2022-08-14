import { recommendationProductClickTracking } from '@/utils/FastSimonTracking';

const cartProductIds = [];
let maxSuggestions = 5; // default
let cabProducts = [];
let swiperWrapper;
let recommendedContainer;
let swiper;

const renderCAB = () => {
  cabProducts.forEach((product) => {
    $(swiperWrapper).append(
      $(`
        <div class="swiper-slide grid-item">
          <a class="product-image" href="${product.u}" title="${product.l}" data-product-id="${product.id}">
            <img src="${product.t}" alt="${product.l}"/>
          </a>
          <div class="product-body">
            <div class="product-name">
              <a class="" href="${product.u}" data-product-id="${product.id}">${product.l}</a>
            </div>
            <div class="product-price justify-content-start">
              <ins class="">$${product.p}</ins>
              <del class="">$${product.p_c}</del>
            </div>
          </div>
        </div>
      `),
    );
  });
  // swiperWrapper
  if (cabProducts.length > 2) {
    const checkId2 = setInterval(() => {
      if (window.Swiper) {
        clearInterval(checkId2);
        swiper = new window.Swiper('.swiper', {
          autoPlay: false,
          loop: true,
          delay: 1,
          speed: 800,
          slidesPerView: 2.5,
          spaceBetween: 10,
          freeMode: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {},
        });
        recommendedContainer.style = '';
      }
    }, 1000);
  } else {
    recommendedContainer.style = '';
    recommendedContainer.classList.add('no-swiper');
  }

  $(document).on('click', '.recommended-container .grid-item a', (e) => {
    // e.preventDefault();
    recommendationProductClickTracking({ productID: e.target.dataset('productId') });
  });
};

const loadCAB = (id) => {
  return new Promise((resolve, reject) => {
    window.FastSimonSDK.productRecommendation({
      productID: id,
      specs: [
        {
          sources: ['similar_products', 'similar_products_by_attributes'],
          maxSuggestions,
          widgetID: 'widget',
        },
      ],
      withAttributes: true,
      callback: (response) => {
        if (!response.payload || response.payload.length < 1) {
          // reject(new Error('no result!'));
        } else {
          // exclude tags with 'STAT-DISC'
          const products = response.payload[0].payload.filter((p) => {
            const attTag = p.att.filter((att) => att[0] === 'Tag');
            if (attTag.length > 0) {
              const tags = attTag[0][1];
              return !tags.includes('STAT-DISC');
            }
            return true;
          });
          cabProducts = [...cabProducts, ...products];
          resolve();
        }
      },
    });
  });
};

const loadCABs = (productIds) => {
  maxSuggestions = productIds.length > 1 ? 4 : 5;
  if (productIds.length > 3) productIds.length = 3;

  let promises = Promise.resolve();
  productIds.forEach((id) => {
    promises = promises.then(() => {
      return loadCAB(id);
    });
  });
  promises.catch((error) => {
    console.error(error);
  });
  promises.finally(() => {
    // remove Personalized Rush Production Time
    cabProducts = cabProducts.filter((p) => p.id !== '6552844959790');
    // remove duplicate
    cabProducts = cabProducts.filter((p, index, array) => array.findIndex((t) => t.id === p.id) === index);
    // remove already in cart
    cabProducts = cabProducts.filter((p) => cartProductIds.findIndex((id) => p.id === id) < 0);
    // random array
    cabProducts.sort(() => Math.random() - 0.5);
    renderCAB();
  });
};

export const initFastSimon = (containerClass) => {
  recommendedContainer = document.querySelector(containerClass);
  swiperWrapper = recommendedContainer.querySelector('.swiper-wrapper');
  const script = document.createElement('script');
  script.src = 'https://assets.fastsimon.com/sdk/latest/fast_simon_sdk.js';
  document.body.appendChild(script);

  let settings;
  const settingsElement = document.querySelector('#tw-fast-simon-settings-json');
  if (settingsElement) {
    try {
      settings = JSON.parse(settingsElement.textContent);
    } catch (error) {
      console.warn(error);
    }
  }
  if (settings) {
    const swiperScript = document.createElement('script');
    swiperScript.src = settings.swiperJS;
    document.body.appendChild(swiperScript);

    const swiperStyle = document.createElement('link');
    swiperStyle.rel = 'stylesheet';
    swiperStyle.href = settings.swiperCSS;
    document.body.appendChild(swiperStyle);

    const checkId = setInterval(() => {
      if (window.FastSimonSDK) {
        clearInterval(checkId);
        window.FastSimonSDK.initialization({
          storeID: settings.storeID,
          uuid: settings.uuid,
          type: 'MPA',
          onReady: () => {
            // console.log('Fast Simon SDK is ready');
            $('.order-summary__section__content tbody tr').each((index, item) => {
              const { productId } = item.dataset;
              if (productId !== '6552844959790') {
                cartProductIds.push(productId);
              }
            });
            // console.log('cartProductIds', cartProductIds);
            loadCABs(cartProductIds);
          },
        });
      }
    }, 1000);
  }
};
