import PropTypes from 'prop-types';

const BannerBlock = ({ banner }) => {
  const {
    promo_banner_desktop: promoBannerDesktop,
    promo_banner_mobile: promoBannerMobile
  } = banner

  return (
    <div className="container banner-block w-100">
      <div className="d-none d-lg-block">
        <img className="w-100" src={promoBannerDesktop} alt="" />
      </div>
      <div className="d-block d-lg-none">
        <img className="w-100" src={promoBannerMobile} alt="" />
      </div>
    </div>
  )
};

BannerBlock.propTypes = {
  banner: PropTypes.object.isRequired,
};

export default BannerBlock;
