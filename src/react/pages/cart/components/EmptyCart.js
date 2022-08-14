import './EmptyCart.scss';
import { memo } from 'react';

const EmptyCart = () => {
  return (
    <div className="cart-empty-container text-center">
      <img className="cart-empty-pic" src={`${window.TW.assetPath}cart-empty.png`} alt="cart empty pic" width="720" height="479" />
      <h1>Your Shopping Cart Is Empty</h1>
      <p>Top categories you might want to consider...</p>
      <div className="cart-tags d-flex flex-wrap justify-content-center">
        <a className="border rounded-pill" href="/collections/sale" target="_self">
          On Sale
        </a>
        <a className="border rounded-pill" href="/collections/new-arrivals" target="_self">
          New Arrival
        </a>
        <a className="border rounded-pill" href="/pages/shop-the-looks" target="_self">
          Shop by Occasions
        </a>
        <a className="border rounded-pill" href="/collections/best-sellers" target="_self">
          Best Seller
        </a>
        <a className="border rounded-pill" href="/collections" target="_self">
          Shop all Categories
        </a>
      </div>
    </div>
  );
};

export default memo(EmptyCart);
