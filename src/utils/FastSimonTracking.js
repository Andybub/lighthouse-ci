// https://docs.fastsimon.com/sdk/docs/events/introduction-to-reporting
import { getParamsFromURL } from '@/react/utils/FastSimon';

const isCollection = window.location.href.includes('/collections/');
const isSERP = window.location.href.includes('/pages/search-results');

const defaultCallback = (response) => {
  console.log('FastSimon defaultCallback', response);
};

export const directProductTracking = ({ productID, callback = defaultCallback }) => {
  // ISP Page Tracking
  // https://docs.fastsimon.com/sdk/docs/events/product-viewed#direct-product-view
  if (!document.referrer.includes('efavormart.com')) {
    // shopper is viewing a product, but it wasn't generated from search nor collection powered by Fast Simon (e.g. direct product view from Google)
    window.FastSimonSDK.event({
      eventName: window.FastSimonEventName.DirectProductClicked,
      reportAppType: window.FastSimonAppType.SinglePage, // no redirect report now
      data: {
        productID, // (Required)
      },
      callback,
    });
  }
};

export const pageTracking = (callback = defaultCallback) => {
  if (!isCollection && !isSERP) {
    return;
  }
  const { sortBy, narrowBy, query } = getParamsFromURL(window.document.location);
  const data = { narrowBy, sortBy };
  let eventName = '';
  if (isCollection) {
    eventName = window.FastSimonEventName.SmartCollectionPreformed;
    data.categoryID = window.TW.collection.categoryID;
  } else if (isSERP) {
    eventName = window.FastSimonEventName.SearchPerformed;
    data.query = query;
  }
  window.FastSimonSDK.event({
    eventName,
    reportAppType: window.FastSimonAppType.SinglePage, // no redirect report now
    data,
    callback,
  });
};

export const quickViewClickTracking = ({ productID, position = 1, callback = defaultCallback }) => {
  if (!isCollection && !isSERP) {
    return;
  }
  const { query } = getParamsFromURL(window.document.location);
  const data = { productID, position };
  let eventName = '';
  if (isCollection) {
    eventName = window.FastSimonEventName.QuickViewClickedCollection;
    data.collectionID = window.TW.collection.categoryID;
  } else if (isSERP) {
    eventName = window.FastSimonEventName.QuickViewClickedSerp;
    data.term = query;
  }
  window.FastSimonSDK.event({
    eventName,
    reportAppType: window.FastSimonAppType.SinglePage, // no redirect report now
    data,
    // type: window.FastSimonAppType.SinglePage,
    callback,
  });
};

export const quickViewDetailClickTracking = ({ productID, callback = defaultCallback }) => {
  if (!isCollection && !isSERP) {
    return;
  }
  window.FastSimonSDK.event({
    eventName: window.FastSimonEventName.QuickViewProductClicked,
    data: {
      productID, // (Required)
      // originalProduct: productID, // (Required)
      // position: 7 // counted from 1
    },
    callback,
  });
};

export const productClickTracking = ({ productID, position = 1, callback = defaultCallback }) => {
  if (!isCollection && !isSERP) {
    return;
  }
  const { query } = getParamsFromURL(window.document.location);
  const data = { productID, position };
  let eventName = '';
  if (isCollection) {
    eventName = window.FastSimonEventName.CollectionProductClicked;
    data.collectionID = window.TW.collection.categoryID;
  } else if (isSERP) {
    eventName = window.FastSimonEventName.SerpProductClicked;
    data.query = query;
  }
  window.FastSimonSDK.event({
    eventName,
    data,
    callback,
  });
};

export const addToCartClickTracking = ({ productID, callback = defaultCallback }) => {
  if (!isCollection && !isSERP) {
    return;
  }
  window.FastSimonSDK.event({
    reportAppType: window.FastSimonAppType.SinglePage, // no redirect report now
    eventName: window.FastSimonEventName.AddToCartPerformed,
    data: {
      productID, // (Required)
    },
    callback,
  });
};

export const recommendationProductClickTracking = ({ productID, callback = defaultCallback }) => {
  window.FastSimonSDK.event({
    eventName: window.FastSimonEventName.RecommendationProductClicked,
    data: {
      productID, // the id of the clicked product (Required)
      // position, // the position of the product in the widget / popup (counted from 1)
      // sourceProductID // source product ID (example product page product ID)
    },
    callback,
  });
};
