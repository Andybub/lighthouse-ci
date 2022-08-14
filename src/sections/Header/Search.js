// TODO redo by react someday
import './Search.scss';

const efmt = 'http://stl-api.efmt.app/f/api/looks/isp';
const moneySymbol = '$';
let searchElement;
let menuContainer;
let menuContent;
let recommendedProducts = [];
let query = '';
let turbolinks = [];
let isEverSearched = false;
let intervalID = false;
let $searchBar;
let $topHeaderContainer;
let $dropdownBlock;

const replaceWithQuery = (label) => {
  if (label && query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return label.replace(regex, `<strong>${moneySymbol}1</strong>`);
  }
  return label || '';
};

const shopLooks = (menu, skus) => {
  const url = `${efmt}?q=${query || ' '}&offset=2&skus=${skus.join(',') || ' '}`;
  if (query) {
    $.ajax({
      url,
      type: 'GET',
      dataType: 'json',
      success: (result) => {
        const dataLink = `/pages/shop-the-looks?page=1&${
          result.search !== 'sku' ? `tags=${result.search}` : `skus=${skus.join(',')}`
        }`;
        const $shopLooks = $('<div/>', { class: 'shop-looks' });
        let content = '<div class="header">';
        content += '<div class="label">Shop The Look</div>';
        content += `<a class="view-more-looks" href="${dataLink}">`;
        content += "view more<i class='icomoon icomoon-arrow-4'></i>";
        content += '</a></div>';
        if (Array.isArray(result.looks)) {
          content += '<ul class="looks">';
          result.looks.forEach((item) => {
            content += '<li>';
            content += `<a class="look-item gtm-searchbar-stl" data-look-id="${item.id}" href="${dataLink}&look=${item.id}">`;
            const imgURL = `url('${item.image_url
              .replace('/s/', '/m/')
              .replace('yaya-stl1.s3.us-east-2.amazonaws.com', 'diukz67o0uvdj.cloudfront.net')}')`;
            content += `<div class="image-show" style="background-image:${imgURL}"></div>`;
            content += '<div class="product-count">';
            content += '<i class="icomoon icomoon-stl-tag"></i>';
            content += `<div>${item.default_tag}</div>`;
            content += '</div></a></li>';
          });
          content += '</ul>';
          $shopLooks.html(content);
          if (!result.looks.length) $shopLooks.hide();
        }
        menu.find('.shop-looks').replaceWith($shopLooks);
      },
    });
  } else {
    menu.find('.shop-looks').hide();
  }
};

const renderCategories = (categories, menu) => {
  const length = window.isMobile.phone ? 4 : 6;
  const categoriesArray = categories.filter(
    (item) =>
      !item.l.startsWith('variant') &&
      !item.l.startsWith('categ-') &&
      // eslint-disable-next-line camelcase, no-undef
      (!search_avoid_collections || !search_avoid_collections.includes(item.u.replace('/collections/', ''))),
  );
  const categoriesItems = categoriesArray.slice(0, length);
  const categoryElements = $('<div />', { class: 'categories' });
  if (categoriesItems.length) {
    let content = '<div class="header"><div class="label">Categories</div></div>';
    content += '<ul>';
    categoriesItems.forEach((item) => {
      content += `
        <li>
          <a class="category-item gtm-searchbar-collection"
          data-category-id="${item.id}" data-category-name="${item.l}" href="${
        item.u
      }" onclick="onSearchMenuItemClick(this, '${query}');">
            <img class=" ls-is-cached lazyload" data-src="${item.t}" alt="">
            <div class="p">${replaceWithQuery(item.l)}</div>
          </a>
        </li>
      `;
    });
    content += '</ul>';
    categoryElements.html(content);
  } else {
    categoryElements.hide();
  }
  if (menu.find('.categories').length) {
    menu.find('.categories').replaceWith(categoryElements);
  }
  if (!query) categoryElements.hide();
};

const renderProducts = (products, menu) => {
  const skus = [];
  const productElements = $('<div />', { class: 'products' });
  // if (!query) productElements.addClass('list');
  let content = '<div class="header"><div class="label">Products</div></div>';
  content += '<ul>';
  const length = window.isMobile.phone ? 6 : 8;
  let netProducts = products.concat(recommendedProducts);
  // exclude Personalized Rush Production Time
  netProducts = netProducts.filter((p) => p.id !== '6552844959790');
  netProducts.slice(0, length).forEach((item) => {
    skus.push(item.sku);

    const imgWidth = '300';
    let imgSrc = item.t2.replace('_small.', '.').replace('_large.', '.');
    imgSrc = imgSrc.includes('?') ? `${imgSrc}&width=${imgWidth}` : `${imgSrc}?width=${imgWidth}`;

    content += `
      <li>
        <a
          class="product-item gtm-searchbar-product"
          data-product-s="${item.s}"
          data-product-id="${item.id}"
          href="${item.u}"
          onclick="onSearchMenuItemClick(this, '${query}');"
        >
          <img class=" ls-is-cached lazyload" data-src="${imgSrc}" alt="">
          <div class="p">${moneySymbol}${item.p}<span>${moneySymbol}${item.p_min_c}</span></div>
          <div class="label">${replaceWithQuery(item.l)}</div>
        </a>
      </li>
    `;
  });
  content += '</ul>';
  if (query) {
    content += `<a class="load-more gtm-searchbar-showall" href="/pages/search-results?q=${query}">`;
    content += `Show All Result For "${query}"`;
    content += '</a>';
  }
  productElements.html(content);
  if (menu.find('.products').length) {
    menu.find('.products').replaceWith(productElements);
  } else {
    menu.append(productElements);
  }
  shopLooks(menu, skus);
};

const renderPopularSearches = (popularSearches, menu) => {
  const suggests = $('<div />', { class: 'suggests' });
  if (Array.isArray(popularSearches) && popularSearches.length) {
    let content = '<div class="header"><div class="label">Popular Search</div></div>';
    content += '<ul>';
    popularSearches.slice(0, 6).forEach((item) => {
      const url = item.url || `/pages/search-results?q=${item.label}`;
      content += `
        <li class="suggest-item">
          <a class="suggest-a-item gtm-searchbar-popular-search"
            href="${url}"
            onclick="onSearchMenuItemClick(this, '${query}');">
              ${replaceWithQuery(item.label)}
          </a>
        </li>
      `;
    });
    content += '</ul>';
    suggests.html(content);
  } else {
    suggests.hide();
  }
  if (menu.find('.suggests').length) {
    menu.find('.suggests').replaceWith(suggests);
  } else {
    menu.append(suggests);
  }
};

const initTurboLinks = () => {
  $('form.search-bar-form').submit((e) => {
    e.preventDefault();
    if (!searchElement.val()) return;
    if (!query) {
      query = searchElement.val();
    }
    if (!isEverSearched) {
      if (window.FastSimonSDK && window.FastSimonSDK.instantSearch) {
        try {
          window.FastSimonSDK.instantSearch({
            query,
            callback: (response) => {
              turbolinks = response.payload.turbolinks;
              // console.log("turbolinks", turbolinks);
              const found = turbolinks.find((link) =>
                query.toLowerCase().includes(String(link.l).toLowerCase().replaceAll('*', '')),
              );
              // console.log("found 1", found);
              if (found) {
                // console.log("founded 1!", query);
                window.location = found.u;
              } else {
                // console.log("not found 1", query);
                window.location = `/pages/search-results?q=${query}`;
              }
            },
          });
        } catch (error) {
          console.warn(error);
          window.location = `/pages/search-results?q=${query}`;
        }
      } else {
        // console.log("window.FastSimonSDK.instantSearch not ready");
        window.location = `/pages/search-results?q=${query}`;
      }
    } else {
      // console.log("turbolinks", turbolinks);
      const found = turbolinks.find((link) =>
        query.toLowerCase().includes(String(link.l).toLowerCase().replaceAll('*', '')),
      );
      // console.log("found 2", found);
      if (found) {
        // console.log("founded 2!", query);
        window.location = found.u;
      } else {
        // console.log("not found 2", query);
        window.location = `/pages/search-results?q=${query}`;
      }
    }
    isEverSearched = true;
  });
};

const instantSearch = (menu) => {
  // console.log('instantSearch');
  if (query) {
    const lastQuery = query;
    try {
      window.FastSimonSDK.instantSearch({
        query,
        callback: (response) => {
          if (lastQuery !== query) return;
          const { categories, popularSearches, products } = response.payload;
          turbolinks = response.payload.turbolinks;
          isEverSearched = true;
          // console.log("turbolinks", turbolinks);
          // menu.find('.products').removeClass('list')
          renderPopularSearches(popularSearches, menu);
          renderProducts(products, menu);
          renderCategories(categories, menu);
        },
      });
    } catch (e) {
      console.warn(e);
    }
  } else {
    // menu.find('.products').addClass('list');
    // menu.find('.suggests').hide();
    menu.find('.shop-looks').hide();
    if (window.suggestedSearchQuery && window.suggestedSearchQuery.length > 0) {
      renderPopularSearches(window.suggestedSearchQuery, menu);
    }
    renderProducts(recommendedProducts, menu);
    renderCategories([], menu);
  }
};

const initSearchMenu = () => {
  // console.log('initSearchMenu');
  // $('<div/>', {class: 'show-search-menu', html: menuContent}).appendTo($searchBar.find('form.search-bar-form').parent())
  $('<div/>', { class: 'show-search-menu', html: menuContent }).appendTo($topHeaderContainer);
  const menu = $topHeaderContainer.find('.show-search-menu');
  menu.hide();
  menuContainer = menu;
  instantSearch(menu);
};

const loadRecommendedProducts = () => {
  window.FastSimonSDK.getAllPopularProducts().then((result) => {
    recommendedProducts = result ? result.slice(0, 8) : [];
    console.log('recommendedProducts', recommendedProducts);
    initSearchMenu();
  });
};

const onISPReady = () => {
  loadRecommendedProducts();
  // Turbolinks
  initTurboLinks();
};

window.onSearchMenuItemClick = (item, queryText) => {
  if (item.classList.contains('suggest-a-item')) {
    window.FastSimonSDK.event({
      eventName: window.FastSimonEventName.AutocompletePopularClicked,
      data: {
        queryText, // (Required)
        term: item.textContent, // (Required)
      },
    });
  } else if (item.classList.contains('category-item')) {
    window.FastSimonSDK.event({
      eventName: window.FastSimonEventName.AutocompleteCategoryClicked,
      data: {
        queryText, // (Required)
        collectionID: item.getAttribute('data-category-id'), // (Required)
      },
    });
  } else if (item.classList.contains('product-item')) {
    window.FastSimonSDK.event({
      eventName: window.FastSimonEventName.AutocompleteProductClicked,
      data: {
        queryText, // (Required)
        productID: item.getAttribute('data-product-id'), // (Required)
        productQuery: item.getAttribute('data-product-s'), // product's 's' key (Required)
      },
    });
  }
};

const onResize = () => {
  // console.log('onResize');
  const h = $('.content_for_page > header').height();
  $('.dropdown-block').css('top', h);
};

const initSearch = () => {
  $topHeaderContainer = $('.top-header-container');
  $dropdownBlock = $('.dropdown-block');
  $searchBar = $('.search-bar');
  searchElement = $searchBar.find("form.search-bar-form input[type='search']");

  menuContent = '<div class="suggests"></div>';
  menuContent += '<div class="categories"></div>';
  menuContent += '<div class="products"></div>';
  menuContent += '<div class="shop-looks"></div>';
  menuContent += '<button type="button" class="btn-search-drop-close"></button>';

  window.FastSimonSDK.avoidDiscontinued = (products) => {
    return new Promise((resolve) => {
      $.ajax({
        url: `/search?view=prodInfo&q=${products.map((product) => `id:${product.id}`).join(' OR ')}`,
        type: 'get',
        dataType: 'json',
        success(response) {
          const availableProducts = response
            .filter((item) => !item.tags.includes('STAT-DISC') && item.inventory_quantity > 0)
            .map((item) => item.id);
          resolve(products.filter((item) => availableProducts.includes(Number(item.id))));
        },
      });
    });
  };

  if (window.TW && window.TW.ISP && window.TW.ISP.READY) {
    onISPReady();
  } else {
    window.TW.ISP.READY_CALLBACKS.push(() => {
      onISPReady();
    });
  }

  searchElement.on('keyup', () => {
    console.log('searchElement keyup');
    // const menu = $searchBar.find('form.search-bar-form').parent().find('.show-search-menu');
    const menu = $topHeaderContainer.find('.show-search-menu');
    if (!menu.length) {
      $('<div/>', { class: 'show-search-menu', html: menuContent }).appendTo($topHeaderContainer);
    }
    // $(".show-search-menu").hide();
    menu.hide();
    // menu.show();
    if ($('.show-search-menu .product-item').length > 0) {
      // console.log("HAS content! (3)");
      const len = $searchBar.find('form.search-bar-form input').val().length;
      if (!window.isMobile.any || len > 0) {
        // menu.show();
        $('.top-header-container').addClass('show-search-bar-menu');
      }
    } else {
      // console.log("no content! (3)");
      // menu.hide();
      $('.top-header-container').removeClass('show-search-bar-menu');
    }
    menuContainer = menu;
    query = searchElement.val();
    if (intervalID) clearTimeout(intervalID);
    intervalID = setTimeout(() => {
      instantSearch(menu);
    }, 50);
  });

  searchElement.on('click', (event) => {
    // console.log('searchElement click');
    event.stopPropagation();
    const menu = $('.show-search-menu');
    if (menu.length) {
      // menu.show();
      if ($('.show-search-menu .product-item').length > 0) {
        // console.log("HAS content! (1)");
        // const len = $searchBar.find('form.search-bar-form input').val().length;
        // console.log('len', len);
        // if (len > 0) {
        //   menu.show();
        // }
        // menu.show();
        $('.top-header-container').addClass('show-search-bar-menu');
        $dropdownBlock.show();
      } else {
        // console.log("no content! (1)");
        // menu.hide();
        $('.top-header-container').removeClass('show-search-bar-menu');
        $dropdownBlock.hide();
      }
    } else if (menuContainer) {
      // scroll down
      $topHeaderContainer.append(menuContainer);
      // menuContainer.show();
      if ($('.show-search-menu .product-item').length > 0) {
        // console.log("HAS content! (2)");
        const len = $searchBar.find('form.search-bar-form input').val().length;
        if (!window.isMobile.any || len > 0) {
          menuContainer.show();
        }
      } else {
        // console.log("no content! (2)");
        menuContainer.hide();
      }
    }
  });

  $('body').on('click', (e) => {
    // console.log('body', e.type);
    // e.stopPropagation();
    // e.preventDefault();
    const $menu = $('.top-header-container .show-search-menu');
    const $btnSearch = $('.top-header-container .btn-search');

    const isCloseBtnClicked = [...e.target.classList].indexOf('btn-search-drop-close') !== -1;

    if ($.contains($btnSearch[0], e.target)) {
      $('.top-header-container').toggleClass('show-search-bar-menu');
      setTimeout(() => {
        $searchBar.find('form.search-bar-form input').focus();
      }, 100);
    } else if (($.contains($menu[0], e.target) || $.contains($searchBar[0], e.target)) && !isCloseBtnClicked) {
      //
    } else {
      $('.top-header-container').removeClass('show-search-bar-menu');
      $dropdownBlock.hide();
    }
  });

  onResize();

  $(window).on('resize', (e) => {
    onResize(e);
  });
};

export default initSearch;
