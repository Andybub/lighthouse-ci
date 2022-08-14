/**
 * Example ------------------------------------------------
 *   initComm100API().then((ready) => {
 *     if (!ready) return;
 *     const chatStatus = getMainChatStatus();
 *     console.log('chatStatus', chatStatus);
 *     if (chatStatus === 'online') openMainChatWindow();
 *   });
 */
const SITE_ID = 1000552;
const MAIN_CAMPAIGN_ID = '95000000-0000-0000-0000-008e000f4468';
const CONTACT_US_DESKTOP_CAMPAIGN_ID = '98000000-0000-0000-0000-008e000f4468';
const CONTACT_US_MOBILE_CAMPAIGN_ID = '8c000000-0000-0000-0000-008e000f4468';

const loadScript = (url = 'https://vue.comm100.com/') => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = `${url}livechat.ashx?siteId=${window.Comm100API.site_id}`;
  script.defer = true;
  document.body.appendChild(script);
};

export const getMainChatStatus = () => {
  const { Comm100API } = window;
  if (!Comm100API.loaded) return '';
  return Comm100API.get('livechat.button.status', MAIN_CAMPAIGN_ID);
};

export const openMainChatWindow = () => {
  const { Comm100API } = window;
  if (!Comm100API.loaded) return;
  Comm100API.do('livechat.button.click', MAIN_CAMPAIGN_ID);
};

export const getContactUsChatStatus = () => {
  const { Comm100API } = window;
  if (!Comm100API.loaded) return '';
  const id = Comm100API.get('livechat.isMobile') ? CONTACT_US_MOBILE_CAMPAIGN_ID : CONTACT_US_DESKTOP_CAMPAIGN_ID;
  return Comm100API.get('livechat.button.status', id);
};

export const openContactUsChatWindow = () => {
  const { Comm100API } = window;
  if (!Comm100API.loaded) return;
  const id = Comm100API.get('livechat.isMobile') ? CONTACT_US_MOBILE_CAMPAIGN_ID : CONTACT_US_DESKTOP_CAMPAIGN_ID;
  Comm100API.do('livechat.button.click', id);
};

export const initComm100API = ({ onlyDesktop = true }) => {
  return new Promise((resolve) => {
    if (onlyDesktop && window.isMobile.any) {
      resolve(false);
      return;
    }

    const Comm100API = window.Comm100API || {};
    Comm100API.onReady = () => {
      resolve(true);
    };

    window.Comm100API = Comm100API;
    const div = document.createElement('div');
    div.id = `comm100-button-${MAIN_CAMPAIGN_ID}`;
    document.body.appendChild(div);

    window.Comm100API.chat_buttons = window.Comm100API.chat_buttons || [];
    window.Comm100API.chat_buttons.push({
      code_plan: MAIN_CAMPAIGN_ID,
      div_id: `comm100-button-${MAIN_CAMPAIGN_ID}`,
    });
    window.Comm100API.site_id = SITE_ID;
    window.Comm100API.main_code_plan = MAIN_CAMPAIGN_ID;

    loadScript();

    setTimeout(() => {
      if (!window.Comm100API.loaded) {
        loadScript('https://standby.comm100vue.com/');
      }
    }, 5000);
  });
};
