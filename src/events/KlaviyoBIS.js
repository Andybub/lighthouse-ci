import { createRoot } from 'react-dom/client';
import KlaviyoBIS from '@/react/pages/popup/BISModal';
import { requestIdleCallback } from '@/utils/Polyfills';

const POPUP_KLAVIYO_BIS = 'popup-klaviyo-bis';
const CLOSE_KLAVIYO_BIS = 'close-klaviyo-bis';

const init = () => {
  let root;

  const dom = document.getElementById('klaviyo-bis-modal');

  const { EventEmitter } = window.TW.main;

  $(dom).on('click', ({ target, currentTarget }) => {
    if (target === currentTarget && !!root) {
      EventEmitter.emit(CLOSE_KLAVIYO_BIS);
    }
  });

  EventEmitter.on(POPUP_KLAVIYO_BIS, (data) => {
    if (root) return;
    root = createRoot(dom);
    root.render(<KlaviyoBIS {...data} />);
    dom.classList.replace('d-none', 'd-block');
    requestIdleCallback(() => {
      dom.classList.add('show');
    });
  });

  EventEmitter.on(CLOSE_KLAVIYO_BIS, () => {
    if (!root) return;
    dom.classList.remove('show');
    setTimeout(() => {
      dom.classList.replace('d-block', 'd-none');
      root.unmount();
      root = null;
    }, 300);
  });
};

export default {
  POPUP_KLAVIYO_BIS,
  CLOSE_KLAVIYO_BIS,
  init,
};
