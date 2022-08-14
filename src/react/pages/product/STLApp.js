import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './STLApp.scss';
import { getLooksByProduct } from '@/react/api/stl';
import RootSwiper from '@/react/ui/stl/RootSwiper';
import { withModalContext, useModalContext } from '@/react/contexts/STLModal';
import Modal from '@/react/ui/stl/Modal';
import { requestIdleCallback } from '@/utils/Polyfills';

const MIN = 6;
const MAX = 12;

const STLApp = ({ productId }) => {
  const [looks, setLooks] = useState(null);

  const { popupLook } = useModalContext();

  useEffect(() => {
    if (!productId) return;

    getLooksByProduct(productId).then((data) => {
      const domRoot = document.getElementById('tw-stl-app');
      const { product_id: id, shop_looks: shopLooks } = data;
      const { length: numLooks } = shopLooks;
      console.log(`${id} --> ${numLooks} looks`);
      if (numLooks < MIN) {
        domRoot.style.display = 'none';
        return;
      }
      if (numLooks > MAX) shopLooks.length = MAX;
      setLooks([...shopLooks]);
      requestIdleCallback(() => {
        domRoot.classList.remove('app-placeholder');
      });
    });
  }, [productId]);

  return (
    <div className="stl-main-container container w-100" id="stl-pdp-container">
      {!!looks && !!looks.length && <h2 className="stl-main-title container">Shop The Look</h2>}
      {!!looks && !!looks.length && <RootSwiper looks={looks} />}
      {!!popupLook && <Modal />}
    </div>
  );
};

STLApp.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default withModalContext(STLApp);
