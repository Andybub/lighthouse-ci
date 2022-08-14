import './Header.scss';
import './AnnouncementBar.scss';
import initTopNav from './TopNav';
import initSearch from './Search';

const initHeader = () => {
  initTopNav();
  initSearch();
};

export default initHeader;
