import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import GridItem from './grid-items/GridItem';
import './WishlistApp.scss';

const WINDOW_WIDTH_LG = 992;

const WishlistApp = ({ data }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mobileMode, setMobileMode] = useState(window.innerWidth < WINDOW_WIDTH_LG);
  const [wishList, setWishList] = useState(data);

  // console.log('WishlistApp', { data });

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    setMobileMode(windowWidth < WINDOW_WIDTH_LG);
  }, [windowWidth]);

  const removeWishlistItem = (epi) =>
    new Promise((resolve) => {
      const { _swat: swat } = window;
      swat.removeFromWishList({ epi }, () => {
        setWishList((list) => list.filter((item) => item.epi !== epi));
        resolve(epi);
      });
    });

  const removeWishlistAll = () => {
    wishList.reduce((promise, { epi }) => promise.then(() => removeWishlistItem(epi)), Promise.resolve());
  };

  return (
    <div className="mt-5 mb-5">
      <div className="wishlist-header mb-5 pb-3 d-flex justify-content-between">
        <h1>My Wishlist</h1>
        {!!wishList && !!wishList.length && (
          <div className="btn-clear" data-toggle="modal" data-target="#removeFromWishListModal">
            <i className="icomoon-remove" /> Clear List
          </div>
        )}
      </div>

      {/* Modal START */}
      <div
        className="modal fade"
        id="removeFromWishListModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="removeFromWishListModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title" id="removeFromWishListModalLongTitle">
                Are you sure?
              </h2>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">Do you want to remove all products from My Wishlist?</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">
                No, I changed my mind
              </button>
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={removeWishlistAll}>
                Yes, remove the items in my list
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal END */}

      {!!wishList && !wishList.length ? (
        <div className="list is-empty text-center mx-auto mt-5">
          <div className="title mb-3">Love It? Add To My Wishlist</div>
          <p className="mb-5">
            My Wishlist allows you to keep track of all of your favorites and shopping activity whether you're on your
            computer, phone, or tablet. You won't have to waste time searching all over again for that item you loved on
            your phone the other day - it's all here in one place!
          </p>
          <a className="btn" href="/">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="collection-product">
          <ul
            className="products-grid product-listing product-list-grid ly__gr_items row flex-flow list-unstyled p-style-01"
            data-grid=" col-xs-6 col-sm-4 col-lg-3"
            data-layout="gr"
          >
            {wishList.map(({ epi, product, variant }) => {
              return (
                <GridItem
                  key={epi}
                  index={epi}
                  product={product}
                  variant={variant}
                  onDelete={() => removeWishlistItem(epi)}
                  windowWidth={windowWidth}
                  // discountBadge={discountBadge}
                  mobileMode={mobileMode}
                  liClass="col-6 col-sm-4 col-lg-2"
                />
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

WishlistApp.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      // https://api-docs.swym.it/v3/index.html#fields-in-list-item
      empi: PropTypes.number.isRequired,
      epi: PropTypes.number.isRequired,
      product: PropTypes.shape({
        // shopify/templates/search.swym-wishlist.liquid
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        personalized: PropTypes.bool.isRequired,
        variants: PropTypes.array.isRequired,
      }),
      variant: PropTypes.shape({
        // shopify/templates/search.swym-wishlist.liquid
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        compare_price: PropTypes.string.isRequired,
        inventory_quantity: PropTypes.number.isRequired,
        inventory_policy: PropTypes.string.isRequired,
        threshold: PropTypes.number.isRequired,
        sold_out: PropTypes.string.isRequired,
      }),
    }),
  ).isRequired,
};

export default WishlistApp;
