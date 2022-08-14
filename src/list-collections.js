import './scss/list-collections.scss';

function initSwiper() {
  const { Swiper } = window;

  // eslint-disable-next-line no-unused-vars
  const shopAllCategories = new Swiper('.swiper-shop-all-categories', {
    loop: true,
    autoplay: true,
    breakpoints: {
      576: {
        slidesPerView: 2,
        autoplay: false,
        allowTouchMove: false,
        spaceBetween: 10,
      }
    }
  });
}

function initPage() {
  $('#shop-all-categories').css('opacity', 1);
}

$(() => {
  initSwiper();

  let $rwdMode = null;
  let $columns = null;
  const $items = $('#shop-all-categories .category').slice(0, 12);

  function onResize() {
    let $rwdModeNew = null;
    const $screenWidth = $(window).width();

    switch ($screenWidth > 0) {
      case ($screenWidth < 576):
        $rwdModeNew = 'mobile';
        $columns = 1;
        break;
      case ($screenWidth >= 576 && $screenWidth < 768):
        $rwdModeNew = 'tablet-portrait';
        $columns = 2;
        break;
      case ($screenWidth >= 768 && $screenWidth < 992):
        $rwdModeNew = 'tablet-landscape';
        $columns = 3;
        break;
      case ($screenWidth >= 992):
        $rwdModeNew = 'desktop';
        $columns = 4;
        break;
      default:
        $rwdModeNew = 'mobile';
        $columns = 1;
    }

    if ($rwdModeNew === $rwdMode) return;
    $rwdMode = $rwdModeNew;

    /** Allocate Items into Columns by Index */
    $('#shop-all-categories .all-collection-page').empty();
    for (let i = 0; i < $columns; i += 1) {
      $('#shop-all-categories .all-collection-page').append('<div class="sub-container"></div>');
    }
    const $subContainers = $('#shop-all-categories .sub-container');

    Array(...$items).forEach((item, idx) => {
      const remainder = idx % $columns;
      $subContainers[remainder].append(item);
    })
  }

  window.addEventListener('resize', () => {
    onResize();
  });
  onResize();

  /**
   * Render Page on Initial
   */
  initPage();

  /**
   * Sublist Drop-down Spread on Click
   */
  $('#shop-all-categories').on('click', '.btn-category', (e) => {
    e.stopPropagation();

    const $currentItem = $(e.currentTarget).parent('.category');

    const $sublist = $($currentItem).find('.sublist');
    if ($sublist.children().length < 1) {
      /** Without Sub-category */
      const $top = $($currentItem).find('.top');
      if ($top.data('url')) {
        window.location.href = $top.data('url');
      }
      return;
    }

    $('#shop-all-categories .category').not($currentItem).removeClass('active');
    $($currentItem).toggleClass('active');

    /** Current Item Scroll To Top */
    if ($rwdMode === 'mobile') {
      const scrollOffset = { scrollTop: ($currentItem.offset().top - 55 - 15) };
      $('html, body').animate(scrollOffset, 300, 'swing');
    }
  })

  /**
   * Sublist Drop-down Blur Effect
   */
  if ($rwdMode !== 'mobile') {
    $('body').on('click', () => {
      $('#shop-all-categories .category').removeClass('active');
    })
  }
})
