import { useEffect, useRef, useState } from 'react';
import './Page.scss';
import SearchBar from '@/react/pages/stl/SearchBar';
import OrderBar from '@/react/pages/stl/OrderBar';
import Filters from '@/react/pages/stl/Filters';
import Gallery from '@/react/pages/stl/Gallery';
import MyPagination from '@/react/pages/stl/MyPagination';
import Modal from '@/react/ui/stl/Modal';
import Loading from '@/react/ui/stl/Loading';
import { getTags, getLooksByQuery } from '@/react/api/stl';
import { useModalContext, withModalContext } from '@/react/contexts/STLModal';

const Page = () => {
  const [looks, setLooks] = useState(null);
  const [totalLooksCount, setTotalLooksCount] = useState(0);
  const [lastParams, setLastParams] = useState('');
  const [queryDone, setQueryDone] = useState(false);

  const {
    popupLook,
    setPopupLook,
    selectedTags,
    setSelectedTags,
    page,
    setPage,
    search,
    setSearch,
    order,
    skus,
    setSkus,
  } = useModalContext();

  const refSearchBar = useRef();

  const [oopsImage, setOopsImage] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tagsOfSearch = searchParams.get('tags');
    const searchOfSearch = searchParams.get('search');
    const pageOfSearch = searchParams.get('page');
    const lookOfSearch = searchParams.get('look');
    const skusOfSearch = searchParams.get('skus');
    const tags = tagsOfSearch ? tagsOfSearch.split(',') : [];
    const initPage = parseInt(pageOfSearch, 10) ? parseInt(pageOfSearch, 10) : 1;
    const initSearch = searchOfSearch || '';
    setSelectedTags(tags);
    setPage(initPage);
    setSearch(initSearch);
    setPopupLook(lookOfSearch || '');
    setSkus(skusOfSearch || '');
    setQueryDone(true);
  }, [setSelectedTags, setPage, setSearch, setPopupLook, setSkus]);

  // for AJAX
  const [isLoaded, setIsLoaded] = useState(true);

  const [sourceTags, setSourceTags] = useState([]);
  useEffect((e) => {
    // Get All Tags
    setIsLoaded(false);
    getTags().then((data) => {
      setIsLoaded(true);
      setSourceTags(data.tags);
    });
  }, []);

  const limit = 30; // item per page
  useEffect(() => {
    if (!queryDone) return;
    // Get looks by some conditions
    const params = [
      `page=${page}`,
      ...(!skus
        ? [`tags=${selectedTags ? selectedTags.join(',') : ''}`, `search=${encodeURIComponent(search)}`]
        : [`skus=${skus}`]),
    ];
    const urlParams = [...params, `look=${popupLook}`].join('&');
    window.history.replaceState(null, null, `?${urlParams}`);

    const apiParams = [`limit=${limit}`, ...params, ...(!order ? [] : [`order=${order}`])].join('&');
    if (lastParams === apiParams) return;
    setLastParams(apiParams);
    setIsLoaded(false);
    getLooksByQuery(apiParams).then((data) => {
      setIsLoaded(true);
      const { shop_looks, total, page } = data;
      setLooks([...shop_looks.filter((look) => !!look.image_url)]); // remove look without image_url
      setTotalLooksCount(total);
      setPage(page);

      refSearchBar?.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }, [queryDone, lastParams, page, selectedTags, search, order, skus, popupLook, setPage]);

  useEffect(() => {
    if (document.getElementById('tw-stl-oops-image')) {
      const image = document.getElementById('tw-stl-oops-image').content.firstElementChild;
      setOopsImage(image.src);
    }
  }, []);

  return (
    <div className="stl-main-container container" id="stl-page-container">
      <div className="stl-scroll-position" ref={refSearchBar} />

      <div className="stl-head-container">
        <SearchBar />
        <OrderBar />
      </div>

      <Filters sourceTags={sourceTags} />

      {!!looks && !looks.length && (
        <div className="tw-stl-oops-container">
          <img className="tw-stl-oops-image" src={oopsImage} alt="Oops... No results found for this search." />
          <div className="tw-stl-oops-text">
            <p className="title">Oops... No results found for this search.</p>
            <p className="text">Try exploring other looks or change the filters!</p>
          </div>
        </div>
      )}

      {!!looks && looks.length > 0 && <Gallery looks={looks} />}

      {looks && looks.length > 0 && Math.round(totalLooksCount / limit) > 0 && (
        <MyPagination total={Math.round(totalLooksCount / limit)} />
      )}

      {popupLook > 0 && <Modal setIsLoaded={setIsLoaded} />}

      {!isLoaded && <Loading />}
    </div>
  );
};

export default withModalContext(Page);
