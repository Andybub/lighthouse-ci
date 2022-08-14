import './index.scss';

const NoResult = () => {

  return (
    <div className="keyword-no-result my-3">
      <div className="container-wrap row flex-lg-row-reverse">
        <div className="right-container col-12 col-lg-6 py-lg-3 text-center">
          <img src={`${window.TW.assetPath}404-serp.svg`} alt="Whoops! No Result Found"/>
        </div>
        <div className="left-container col-12 col-lg-6 py-5 py-lg-0 d-flex flex-column justify-content-center align-items-center text-center">
          <h2 className="title text-center mb-3">No Result Found!</h2>
          <p className="sub text-center mb-3">
            The product your are looking for is in process...<br/>
            It will be availiable very soon or you can suggest it!
          </p>
          <a href="/collections" className="btn-shop-all rounded-pill mb-3">Shop All Categories</a>
          <a href="/pages/suggest-a-product" className="btn-suggest">Suggest Us New Products</a>
        </div>
      </div>
      <div className="border-bottom col-12 mt-3 mb-3"/>
      <p className="txt-popular-products col-12 text-center mb-0">Top products you might want to consider...</p>
    </div>
  );
};

export default NoResult;