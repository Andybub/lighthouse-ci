import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getProductsById } from '@/service/ProductAPI';
// import RenderTip from '@/react/utils/RenderTip';
import { pageTracking } from '@/utils/FastSimonTracking';
import {
  getParamsFromURL,
  patchProductsData,
  sortByMapping,
  collectionVariablesFormalization,
} from '@/react/utils/FastSimon';
import SubCategories from '@/react/pages/collection/block/SubCategories';
import Filters from '@/react/pages/collection/filters';
import Mid from '@/react/pages/collection/mid';
import Narrow from '@/react/pages/collection/narrow';
import GridItems from '@/react/pages/collection/grid-items';
import Pagination from '@/react/pages/collection/pagination';
import useBackButton from '@/react/pages/collection/hooks/useBackButton';
import NoResult from './no-result';
import RelatedTerms from './related-terms';
import './SearchResult.scss';

const SearchResultApp = ({ page, sortBy, narrowBy, query }) => {
  // console.log('SearchResultApp');
  // const { page, sortBy, narrowBy, query } = getParamsFromURL(document.location);
  const [firstTime, setFirstTime] = useState(true);
  const [realRequest, setRealRequest] = useState({ page, sortBy, narrowBy, query });
  const [realPayload, setRealPayload] = useState(null);
  const [tempRequest, setTempRequest] = useState({ page, sortBy, narrowBy, query });
  const [tempPayload, setTempPayload] = useState(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mobileMode, setMobileMode] = useState(window.innerWidth < 992);
  // const [isLoading, setIsLoading] = useState(false);
  const [filterDisplay, setFilterDisplay] = useState(false);

  const [relatedTerms, setRelatedTerms] = useState([]);
  const [relatedCategories, setRelatedCategories] = useState([]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });

    setTimeout(() => {
      window.FastSimonSDK.instantSearch({
        query,
        callback: (response) => {
          // console.log("FastSimonSDK.instantSearch");
          console.log(response);
          if (response.payload.categories.length > 0) {
            // filter
            response.payload.categories = response.payload.categories.filter(
              (item) =>
                !item.l.startsWith('variant') &&
                !item.l.startsWith('categ-') &&
                (!search_avoid_collections || !search_avoid_collections.includes(item.u.replace('/collections/', ''))),
            );
            // max 4 items
            response.payload.categories = response.payload.categories.slice(0, 4);
            setRelatedCategories(response.payload.categories.map((c) => collectionVariablesFormalization(c)));
          }
          if (response.payload.popularSearches.length > 0) {
            setRelatedTerms(response.payload.popularSearches.map((s) => s.label));
          }
        },
      });
    }, 2000);
  }, []);

  const isBack = useBackButton();
  useEffect(() => {
    // console.log('isBack changed!');
    if (isBack) {
      // console.log('in');
      const { page, sortBy } = realPayload;
      const narrowBy = realPayload.narrowBy ? realPayload.narrowBy : [];
      const {
        page: tmpPage,
        sortBy: tmpSortBy,
        narrowBy: tmpNarrowBy,
        query: tmpQuery,
      } = getParamsFromURL(document.location);
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
        setRealRequest({ page: tmpPage, sortBy: tmpSortBy, narrowBy: tmpNarrowBy, query: tmpQuery });
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
        config.narrowBy = request.narrowBy;
      }

      config.term = request.query;
      // https://docs.fastsimon.com/sdk/docs/usages/full-text-search
      window.FastSimonSDK.fullTextSearch(config);
    }
  }, [realRequest]);

  useEffect(() => {
    // console.log('realPayload changed!');
    // console.log({...realPayload});
    if (realPayload && realPayload.products) {
      if (realPayload.productsUpdated) {
        // console.log('useEffect history');
        const { page, sortBy, query } = realPayload;
        const narrowBy = realPayload.narrowBy ? realPayload.narrowBy : [];
        // console.log('page', page, 'sortBy', sortBy, 'narrowBy', narrowBy);
        const { page: tmpPage, sortBy: tmpSortBy, narrowBy: tmpNarrowBy } = getParamsFromURL(document.location);
        // console.log('tmpPage', tmpPage, 'tmpSortBy', tmpSortBy, 'tmpNarrowBy', tmpNarrowBy, 'tmpTerm', tmpTerm);
        // TODO what if tmpNarrowBy and narrowBy's content are in different order?
        if (
          String(tmpPage) === String(page) &&
          tmpSortBy === sortBy &&
          JSON.stringify(tmpNarrowBy) === JSON.stringify(narrowBy)
        ) {
          // console.log('history do nothing!');
        } else {
          // console.log('history push!');
          let urlParams = `page_num=${page}&sort_by=${sortBy}&q=${query}`;
          if (narrowBy.length > 0) {
            let narrowByStr = JSON.stringify(narrowBy);
            narrowByStr = encodeURIComponent(narrowByStr);
            // console.log('narrowByStr', narrowByStr);
            urlParams = `${urlParams}&narrow=${narrowByStr}`;
          }
          // console.log(urlParams);
          window.history.pushState(null, null, `?${urlParams}`);
        }
        const headerHeight = document.querySelector('header').clientHeight;
        const resultWrapHeight = document.querySelector('.result-wrap')
          ? document.querySelector('.result-wrap').clientHeight
          : 0;
        const relatedTermContainerHeight = document.querySelector('.related-term-container')
          ? document.querySelector('.related-term-container').clientHeight
          : 0;
        const blockHeight = document.querySelector('.block-container')
          ? document.querySelector('.block-container').clientHeight
          : 0;
        let toTop;
        if (mobileMode) {
          toTop = headerHeight + resultWrapHeight + relatedTermContainerHeight + blockHeight - 40;
        } else {
          toTop = headerHeight + resultWrapHeight + relatedTermContainerHeight + blockHeight - 90;
        }
        // console.log('firstTime', firstTime);
        if (firstTime) {
          toTop = 0;
        }
        // console.log('headerHeight', headerHeight);
        // console.log('resultWrapHeight', resultWrapHeight);
        // console.log('relatedTermContainerHeight', relatedTermContainerHeight);
        // console.log('blockHeight', blockHeight);
        // console.log('toTop', toTop);
        window.scrollTo({ top: toTop, behavior: 'auto' });
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

      config.term = request.query;
      // https://docs.fastsimon.com/sdk/docs/usages/full-text-search
      window.FastSimonSDK.fullTextSearch(config);
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

  return (
    <div className="tw-react-search-result d-flex flex-wrap pt-3">
      {/* <RenderTip /> */}
      {realPayload && realPayload.totalResults > 0 && (
        <h1 className="result-wrap w-100">
          <span className="title font-weight-normal">Search Result :</span>
          <span className="result-term ml-3">{realPayload.query}</span>
          <span className="text-hide">(in Efavormart)</span>
        </h1>
      )}
      {realPayload && realPayload.query && relatedTerms.length > 0 && (
        <RelatedTerms mainTerm={realPayload.query} relatedTerms={relatedTerms} setRealRequest={setRealRequest} />
      )}
      {relatedCategories.length > 0 && (
        <div className="block-container w-100 pt-4 pb-4">
          <SubCategories relatedSubCategories={relatedCategories} />
        </div>
      )}
      <div className="main-container row justify-content-center">
        {realPayload && realPayload.facets && !realPayload.isNoResults && (
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

        <div className="result-container col-12 col-lg-9 pb-4">
          {realPayload && realPayload.sortBy && !realPayload.isNoResults && (
            <Mid realPayload={realPayload} setRealRequest={setRealRequest} setFilterDisplay={setFilterDisplay} />
          )}
          {realPayload && realPayload.narrowBy && realPayload.narrowBy.length > 0 && (
            <Narrow realPayload={realPayload} setRealRequest={setRealRequest} />
          )}
          {realPayload && realPayload.isNoResults && <NoResult />}
          {realPayload && realPayload.products && realPayload.products.length > 0 && (
            <GridItems realPayload={realPayload} windowWidth={windowWidth} mobileMode={mobileMode} />
          )}
          {realPayload && realPayload.pageCount > 1 && (
            <Pagination realPayload={realPayload} setRealRequest={setRealRequest} />
          )}
        </div>
      </div>
    </div>
  );
};

SearchResultApp.propTypes = {
  page: PropTypes.number,
  sortBy: PropTypes.string,
  narrowBy: PropTypes.array,
  query: PropTypes.string,
};

SearchResultApp.defaultProps = {
  page: 1,
  sortBy: '',
  narrowBy: [],
  query: '',
};

export default SearchResultApp;
