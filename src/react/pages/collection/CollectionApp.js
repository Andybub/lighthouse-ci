import './CollectionApp.scss';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getProductsById } from '@/service/ProductAPI';
// import RenderTip from '@/react/utils/RenderTip';
import { pageTracking } from '@/utils/FastSimonTracking';
import { getParamsFromURL, patchProductsData, sortByMapping } from '../../utils/FastSimon';
import Block from './block';
import Filters from './filters';
import Mid from './mid';
import Narrow from './narrow';
import NoResult from './no-result';
import GridItems from './grid-items';
import Pagination from './pagination';
import Description from './description';
import useBackButton from './hooks/useBackButton';
import BtnSizeChart from './btn-size-chart/BtnSizeChart';

const CollectionApp = ({
  page,
  sortBy,
  narrowBy,
  categoryID,
  title,
  relatedSubCategories,
  metafields,
  description,
}) => {
  // console.log('======== CollectionApp render! =======');
  // const { page, sortBy, narrowBy } = getParamsFromURL(document.location);
  // console.log('narrowBy', narrowBy);
  const [firstTime, setFirstTime] = useState(true);
  const [realRequest, setRealRequest] = useState({ page, sortBy, narrowBy });
  const [realPayload, setRealPayload] = useState(null);
  const [tempRequest, setTempRequest] = useState({ page, sortBy, narrowBy });
  const [tempPayload, setTempPayload] = useState(null);
  const [relatedPayload, setRelatedPayload] = useState(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mobileMode, setMobileMode] = useState(window.innerWidth < 992);
  // const [isLoading, setIsLoading] = useState(false);
  const [filterDisplay, setFilterDisplay] = useState(false);
  const [goToListTop, setGoToListTop] = useState(false);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  const isBack = useBackButton();
  useEffect(() => {
    // console.log('isBack changed!');
    if (isBack) {
      // console.log('in');
      const { page, sortBy } = realPayload;
      const narrowBy = realPayload.narrowBy ? realPayload.narrowBy : [];
      const { page: tmpPage, sortBy: tmpSortBy, narrowBy: tmpNarrowBy } = getParamsFromURL(document.location);
      // console.log(tmpPage, tmpSortBy, tmpNarrowBy);
      // console.log(page, sortBy, narrowBy);
      if (
        String(tmpPage) === String(page) &&
        tmpSortBy === sortBy &&
        JSON.stringify(tmpNarrowBy) === JSON.stringify(narrowBy)
      ) {
        // console.log('isBack do nothing!');
      } else {
        // console.log('isBack set request!');
        setRealRequest({ page: tmpPage, sortBy: tmpSortBy, narrowBy: tmpNarrowBy });
      }
    }
  }, [isBack]);

  useEffect(() => {
    // console.log('realRequest updated!');
    if (realRequest) {
      // console.log('in');
      // 1. Fetch data by Fast Simon SDK.
      // 2. Patch data by Shopify Search.
      const request = realRequest;

      const config = {
        page: request.page, // use for pagination
        productsPerPage: 40, // use for custom product count
        sortBy: request.sortBy, // Possible options: relevancy, price_min_to_max, price_max_to_min, creation_date, creation_date_oldest, reviews, a_to_z, z_to_a
        // narrowBy, // use for filtering  [["Size","M"],["Color","Blue"],["Color","RED"]], DO NOT PASS narrowBy IF EMPTY.
        facets: true, // use facets:false if you do not need filters
        withAttributes: true, // use withAttributes:true if you want to include attributes in the product response
        callback: (response) => {
          if (response.action === 'facets and products') {
            console.log(response);
            const { payload } = response;
            // exclude SHOPSTORM_HIDDEN_PRODUCT
            payload.products = payload.products.filter(
              (product) => product.id !== '8752292626' && product.id !== '6552844959790',
            );
            if (!payload.sortBy || payload.sortBy === 'relevency') {
              payload.sortBy = sortByMapping[0].key;
            }
            payload.narrowBy = payload.narrow ? payload.narrow : [];
            // console.log('payload', payload);
            // console.log('narrowBy', JSON.stringify(payload.narrowBy));
            setRealPayload(payload);
          }
        },
      };

      if (request.narrowBy && request.narrowBy.length > 0) {
        console.log('request.narrowBy', request.narrowBy);
        config.narrowBy = request.narrowBy;
      }

      config.categoryID = categoryID;
      // https://docs.fastsimon.com/sdk/docs/usages/smart-collections
      window.FastSimonSDK.smartCollections(config);
    }
  }, [realRequest]);

  function goToProductListTop() {
    const headerHeight = document.querySelector('header').clientHeight;
    const blockHeight = document.querySelector('.block-container').clientHeight;
    let toTop;
    if (mobileMode) {
      toTop = headerHeight + blockHeight + 30;
    } else {
      // eslint-disable-next-line no-unused-vars
      toTop = headerHeight + blockHeight - 50;
    }
    // console.log('headerHeight', headerHeight);
    // console.log('blockHeight', blockHeight);
    // console.log('toTop', toTop);
    window.scrollTo({ top: toTop, behavior: 'auto' });
  }

  useEffect(() => {
    // console.log('realPayload changed!');
    // console.log({...realPayload});
    if (realPayload && realPayload.products) {
      if (realPayload.productsUpdated) {
        // console.log('useEffect history');
        const { page, sortBy } = realPayload;
        const narrowBy = realPayload.narrowBy ? realPayload.narrowBy : [];
        // console.log('page', page, 'sortBy', sortBy, 'narrowBy', narrowBy);
        const { page: tmpPage, sortBy: tmpSortBy, narrowBy: tmpNarrowBy } = getParamsFromURL(document.location);
        // console.log('tmpPage', tmpPage, 'tmpSortBy', tmpSortBy, 'tmpNarrowBy', tmpNarrowBy);
        // TODO what if tmpNarrowBy and narrowBy's content are in different order?
        if (
          String(tmpPage) === String(page) &&
          tmpSortBy === sortBy &&
          JSON.stringify(tmpNarrowBy) === JSON.stringify(narrowBy)
        ) {
          // console.log('history do nothing!');
        } else {
          // console.log('history push!');
          let urlParams = `page_num=${page}&sort_by=${sortBy}`;
          if (narrowBy.length > 0) {
            let narrowByStr = JSON.stringify(narrowBy);
            narrowByStr = encodeURIComponent(narrowByStr);
            // console.log('narrowByStr', narrowByStr);
            urlParams = `${urlParams}&narrow=${narrowByStr}`;
          }
          // console.log(urlParams);
          window.history.pushState(null, null, `?${urlParams}`);
        }

        if (!goToListTop) {
          setGoToListTop(true);
        } else {
          goToProductListTop();
        }

        pageTracking();
      } else {
        // console.log('update product!');
        getProductsById(realPayload.products.map((p) => p.id)).then((response) => {
          // mix-data
          // setProducts(patchProductsData(realPayload.products, response));
          setRealPayload({
            ...realPayload,
            products: patchProductsData(realPayload.products, response),
            productsUpdated: true,
          });
          setTempPayload(null);
        });
      }
    }
  }, [realPayload]);

  useEffect(() => {
    // console.log('tempRequest changed!');
    if (tempRequest && firstTime === false) {
      // console.log('in');
      const request = tempRequest;
      const config = {
        page: request.page, // use for pagination
        productsPerPage: 40, // use for custom product count
        sortBy: request.sortBy, // Possible options: relevancy, price_min_to_max, price_max_to_min, creation_date, creation_date_oldest, reviews, a_to_z, z_to_a
        // narrowBy, // use for filtering  [["Size","M"],["Color","Blue"],["Color","RED"]], DO NOT PASS narrowBy IF EMPTY.
        facets: true, // use facets:false if you do not need filters
        withAttributes: true, // use withAttributes:true if you want to include attributes in the product response
        callback: (response) => {
          if (response.action === 'facets and products') {
            console.log(response);
            const { payload } = response;
            payload.products = payload.products.filter(
              (product) => product.id !== '8752292626' && product.id !== '6552844959790',
            );
            if (!payload.sortBy || payload.sortBy === 'relevency') {
              payload.sortBy = sortByMapping[0].key;
            }
            payload.narrowBy = payload.narrow ? payload.narrow : [];
            // console.log('payload', payload);
            // console.log('narrowBy', JSON.stringify(payload.narrowBy));
            setTempPayload(payload);
          }
        },
      };

      if (request.narrowBy && request.narrowBy.length > 0) {
        config.narrowBy = request.narrowBy;
      }
      config.categoryID = categoryID;
      // https://docs.fastsimon.com/sdk/docs/usages/smart-collections
      window.FastSimonSDK.smartCollections(config);
    } else {
      // setTempPayload(null);
    }
    setFirstTime(false);
  }, [tempRequest]);

  useEffect(() => {
    // console.log('filterDisplay changed!');
    if (filterDisplay && mobileMode) {
      document.body.classList.add('filter-open');
    } else {
      document.body.classList.remove('filter-open');
      setTempPayload(null);
    }
  }, [filterDisplay]);

  useEffect(() => {
    // console.log('windowWidth changed!');
    setMobileMode(windowWidth < 992);
  }, [windowWidth]);

  useEffect(() => {
    if (mobileMode && relatedSubCategories.length > 0 && metafields.global.force_display_isp_products === false) {
      if (!relatedPayload) {
        const products = relatedSubCategories.reduce((prev, curr) => {
          if (prev.products) {
            return prev.products.concat(curr.products);
          }
          return prev.concat(curr.products);
        }, []);
        // console.log(products);
        setRelatedPayload({ products, productsUpdated: false });
      } else if (!relatedPayload.productsUpdated) {
        getProductsById(relatedPayload.products.map((p) => p.id)).then((response) => {
          // mix-data
          setRelatedPayload({
            ...relatedPayload,
            products: patchProductsData(relatedPayload.products, response),
            productsUpdated: true,
          });
        });
      }
    }
  }, [mobileMode, relatedSubCategories, relatedPayload, setRelatedPayload, metafields]);

  return (
    <div className="tw-react-collections d-flex flex-wrap pt-3">
      {/* <RenderTip /> */}
      <div className="title-container w-100 d-flex align-items-center justify-content-between mb-4">
        <h1 className="w-100 mb-0 text-left text-sm-center">{title}</h1>
        {metafields.global.size_chart === 1 && <BtnSizeChart />}
      </div>
      <Block title={title} metafields={metafields} relatedSubCategories={relatedSubCategories} />
      <div className="main-container row justify-content-center">
        {realPayload && realPayload.facets && (
          <Filters
            mobileMode={mobileMode}
            filterDisplay={filterDisplay}
            setFilterDisplay={setFilterDisplay}
            realPayload={realPayload}
            setRealRequest={setRealRequest}
            setRealPayload={setRealPayload}
            tempPayload={tempPayload}
            setTempRequest={setTempRequest}
            tempRequest={tempRequest}
          />
        )}

        <div className="result-container col-12 col-lg-9">
          {!(mobileMode && relatedPayload) && realPayload && realPayload.sortBy && (
            <Mid realPayload={realPayload} setRealRequest={setRealRequest} setFilterDisplay={setFilterDisplay} />
          )}
          {realPayload && realPayload.narrowBy && realPayload.narrowBy.length > 0 && (
            <Narrow realPayload={realPayload} setRealRequest={setRealRequest} />
          )}
          {realPayload && realPayload.isNoResults && <NoResult setRealRequest={setRealRequest} />}
          {realPayload && realPayload.products && realPayload.products.length > 0 && (
            <GridItems
              realPayload={realPayload}
              windowWidth={windowWidth}
              mobileMode={mobileMode}
              relatedPayload={relatedPayload}
            />
          )}
          {!(mobileMode && relatedPayload) && realPayload && realPayload.pageCount > 1 && (
            <Pagination realPayload={realPayload} setRealRequest={setRealRequest} />
          )}
        </div>
        {description && <Description description={description} />}
      </div>
    </div>
  );
};

CollectionApp.propTypes = {
  page: PropTypes.number,
  sortBy: PropTypes.string,
  narrowBy: PropTypes.array,
  categoryID: PropTypes.string,
  title: PropTypes.string,
  relatedSubCategories: PropTypes.array,
  metafields: PropTypes.array,
  description: PropTypes.string,
};

CollectionApp.defaultProps = {
  page: 1,
  sortBy: '',
  narrowBy: [],
  categoryID: '',
  title: '',
  relatedSubCategories: [],
  metafields: [],
  description: '',
};

export default CollectionApp;
