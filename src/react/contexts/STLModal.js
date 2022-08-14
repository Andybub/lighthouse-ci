import { createContext, useContext, useState, useMemo, useEffect } from 'react';

const ModalContext = createContext(null);

export const useModalContext = () => useContext(ModalContext);

export const withModalContext = Component => props => {

  const [popupLook, setPopupLook] = useState(0);
  const [popupProduct, setPopupProduct] = useState(0);
  const [lookRatio, setLookRatio] = useState(1);
  const [lookWidth, setLookWidth] = useState(0);
  const [respondMobile, setRespondMobile] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  // Filter
  const [selectedTags, setSelectedTags] = useState(null);
  // page
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState('')
  // search dropdown
  const [skus, setSkus] = useState('');
  // swiper
  const [swiperIndex, setSwiperIndex] = useState(-1);

  const modalProviderValue = useMemo(() => ({
    popupLook, setPopupLook,
    popupProduct, setPopupProduct,
    lookRatio, setLookRatio,
    lookWidth, setLookWidth,
    respondMobile, setRespondMobile,
    hoveredProductId, setHoveredProductId,
    // Filter
    selectedTags, setSelectedTags,
    // Page
    page, setPage, search, setSearch, order, setOrder,
    // search dropdown
    skus, setSkus,
    // swiper
    swiperIndex, setSwiperIndex,
  }), [
    popupLook, popupProduct, lookRatio, lookWidth, respondMobile, hoveredProductId, selectedTags,
    page, search, order, skus, swiperIndex,
  ]);

  useEffect(() => {
    console.log(popupLook, popupProduct);
  }, [popupLook, popupProduct]);

  return (
    <ModalContext.Provider value={modalProviderValue}>
      <Component {...props} />
    </ModalContext.Provider>
  );
};
