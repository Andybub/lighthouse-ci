import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import './Modal.scss';
import Loading from '@/react/ui/stl/Loading';
import ProductContainer from '@/react/ui/stl/ProductContainer';
import ImageDots from '@/react/ui/stl/ImageDots';
import GridProductContainer from '@/react/ui/stl/GridProductContainer';
import { useModalContext } from '@/react/contexts/STLModal';
import { getLookDetail, getProductsByQuery } from '@/react/api/stl';
import { enablePreorder, underThreshold, availableMessage, inventoryQuantity } from '@/react/utils/stl';

const Modal = () => {
  const scrollRef = useRef();

  const {
    popupLook,
    setPopupLook,
    popupProduct,
    setPopupProduct,
    lookRatio,
    lookWidth,
    respondMobile,
    setRespondMobile,
  } = useModalContext();

  const [loading, setLoading] = useState(true);
  const [lookData, setLookData] = useState(null);

  const handleModalClose = useCallback(() => {
    setPopupProduct(0);
    setPopupLook(0);
  }, [setPopupProduct, setPopupLook]);

  const handleModalBack = useCallback(() => {
    setPopupProduct(0);
  }, [setPopupProduct]);

  const limitedTitle = useMemo(() => {
    if (!lookData || !lookData.title) return '';
    const { title } = lookData;
    return title.length < 30 ? title : `${title.substring(0, 30)}...`;
  }, [lookData]);

  const contentHeight = useMemo(() => {
    if (respondMobile) return '100%';
    if (lookRatio <= 1) return 'auto';
    return `${Math.floor(lookWidth / lookRatio)}px`;
  }, [respondMobile, lookRatio, lookWidth]);

  const contentClassNames = useMemo(() => {
    const classNames = ['stl-modal-content-container'];
    if (lookData?.submitted_by) classNames.push('no-submitted-by');
    if (lookRatio > 1) classNames.push('is-landscape');
    if (popupProduct) classNames.push('popup-product');
    return classNames.join(' ');
  }, [lookData, lookRatio, popupProduct]);

  useEffect(() => {
    const handleMediaQuery = ({ matches }) => setRespondMobile(matches);
    const mq = window.matchMedia('screen and (max-width: 900px)');
    if (mq.addEventListener) {
      mq.addEventListener('change', handleMediaQuery);
    } else {
      // iOS 13
      mq.addListener(handleMediaQuery);
    }
    handleMediaQuery(mq);
    return () => {
      if (mq.addEventListener) {
        mq.removeEventListener('change', handleMediaQuery);
      } else {
        mq.removeListener(handleMediaQuery);
      }
    };
  }, [setRespondMobile]);

  useEffect(() => {
    disableBodyScroll(scrollRef.current, {
      /* eslint-disable */
      allowTouchMove: (el) => {
        while (el && el !== document.body) {
          if (el.classList.contains('body-scroll-lock-ignore')) {
            return true;
          }
          el = el.parentNode;
        }
      },
      /* eslint-enable */
    });
    return clearAllBodyScrollLocks;
  }, []);

  useEffect(() => {
    const klaviyoSendFunc = window.klaviyoBIS?.sendData;
    if (!klaviyoSendFunc) {
      console.error('NO KlavioyBIS.sendData', window.klaviyoBIS);
      return;
    }
    window.klaviyoBIS.sendData = ($container, email, productId, variantId) => {
      $container.addClass('sending');
      window.$.ajax({
        type: 'POST',
        url: 'https://o0r4rf9psj.execute-api.us-east-2.amazonaws.com/v1/bis/efmt',
        data: {
          email,
          product: productId,
          variant: variantId,
          send_to: 3,
        },
        dataType: 'json',
        success: () => {
          $container.addClass('success');
        },
        error: () => {
          $container.addClass('error');
          $container.find('.hint span').text('Please try again later');
        },
        complete: () => {
          $container.removeClass('sending');
        },
      });
    };
    // eslint-disable-next-line
    return () => {
      if (klaviyoSendFunc) window.klaviyoBIS.sendData = klaviyoSendFunc;
    };
  }, []);

  useEffect(() => {
    if (!popupLook) return;

    // Get looks detail by id
    const loadLooks = async () => {
      setLoading(true);
      try {
        const lookResult = await getLookDetail(popupLook).then((data) => data.shop_look);
        const { products } = lookResult;
        const arrProductIDs = products
          .filter(({ shopable }) => shopable)
          .reduce((list, { product_id: id }) => [...list, id], [])
          .filter((id, index, array) => array.indexOf(id) === index)
          .map((id) => `id:${id}`);
        const strProductIDs = encodeURIComponent(arrProductIDs.join(' OR '));
        const productsResult = await getProductsByQuery(strProductIDs);
        lookResult.products = products
          .map((product) => {
            const data = productsResult.find(({ id }) => id === product.product_id);
            if (!data) return product;
            // checking inventory status
            const { available, type } = data;
            const customize = type === 'Personalized';
            const preorder = enablePreorder(data);
            const almostGone = underThreshold(data);
            const preorderMsg = availableMessage(data);
            const quantity = inventoryQuantity(data);
            return { ...product, data, available, customize, preorder, almostGone, preorderMsg, quantity };
          })
          .filter(({ data }) => data);
        // sorting by inventory status
        lookResult.products.sort((x, y) => {
          if (!x.available && !y.available) return 0;
          if (!x.available && y.available) return 1;
          if (x.available && !y.available) return -1;
          if (!x.preorder && y.preorder) return -1;
          if (x.preorder && !y.preorder) return 1;
          return 0;
        });
        setLookData(lookResult);
      } catch (err) {
        setPopupLook(0);
        console.error(err);
      }
      setLoading(false);
    };

    loadLooks();
  }, [popupLook, setPopupLook]);

  return (
    <div className="stl-modal-container" ref={scrollRef}>
      <div className="stl-modal-block" onClick={handleModalClose} />

      {loading && <Loading />}

      {!loading && !!lookData && console.log({ lookData })}

      {!loading && !!lookData && (
        <div className={contentClassNames}>
          {!!popupProduct && (
            <button type="button" className="stl-btn-back" onClick={handleModalBack}>
              <span className="icomoon-arrow-4" />
            </button>
          )}
          <p className="stl-content-title">
            <span className="stl-title">{limitedTitle}</span>
            {lookData.submitted_by && <span className="stl-submitted-by">Submitted by {lookData.submitted_by}</span>}
          </p>
          {(!respondMobile || popupProduct < 1) && (
            <button type="button" className="stl-btn-close" onClick={handleModalClose}>
              <span className="icomoon-close" />
            </button>
          )}
          <div className="stl-model-content-wrapper" style={{ height: contentHeight }}>
            <ImageDots title={lookData.title} imageUrl={lookData.image_url} products={lookData.products} />
            <GridProductContainer lookData={lookData} />
            {!!popupProduct && <ProductContainer lookData={lookData} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
