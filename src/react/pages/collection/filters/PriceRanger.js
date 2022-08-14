import './PriceRanger.scss';
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const PriceRanger = (props) => {
  const { priceMin, priceMax, onAfterClick } = props;
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(0);
  const [error, setError] = useState(false);

  const onChange = useCallback((e) => {
    const { id, value } = e.target;
    // console.log('id', id, 'value', value);
    if (id === 'price-min') {
      setPriceFrom(parseInt(value, 10));
    } else if (id === 'price-max') {
      setPriceTo(parseInt(value, 10));
    }
  }, []);

  const onClick = useCallback(() => {
    const isError = priceFrom < 0 || priceTo < 0 || priceFrom >= priceTo || priceTo === 0;
    setError(isError);
    if (!isError) {
      onAfterClick([priceFrom, priceTo]);
    }
  }, [priceFrom, priceTo]);

  return (
    <div
      className="price-container d-flex flex-wrap justify-content-between align-items-center w-100"
      data-error={error}
    >
      <div className="price-control d-flex align-items-center">
        <label className="mb-0 mr-3" htmlFor="price-min">
          $
        </label>
        <input id="price-min" className="mb-0" type="number" placeholder="0" onChange={onChange} />
      </div>
      <span className="minus"> - </span>
      <div className="price-control d-flex align-items-center">
        <label className="mb-0 mr-3" htmlFor="price-max">
          $
        </label>
        <input id="price-max" className="mb-0" type="number" placeholder="100" onChange={onChange} />
      </div>
      <button onClick={onClick} type="button" className="btn btn-submit">
        <i className="fkt-angle-right" aria-hidden="true" />
      </button>
      <p className="error-message d-none mb-0 w-100">Please fix price range</p>
    </div>
  );
};

PriceRanger.propTypes = {
  priceMax: PropTypes.number.isRequired,
  priceMin: PropTypes.number.isRequired,
  onAfterClick: PropTypes.func.isRequired,
};

export default PriceRanger;
