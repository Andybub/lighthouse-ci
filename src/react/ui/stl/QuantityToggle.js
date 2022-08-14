import PropTypes from 'prop-types';
import './QuantityToggle.scss';

const QuantityToggle = ({ quantity, setQuantity }) => {
  const onMinusClickHandler = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const onPlusClickHandler = () => {
    setQuantity(quantity + 1);
  };

  const onQuantityChangeHandler = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 1) {
      setQuantity(value);
    } else {
      setQuantity(1);
    }
  };

  return (
    <div className="stl-quantity-container">
      <button type="button" className="btn-minus" onClick={onMinusClickHandler}>
        {' - '}
      </button>
      <input className="txt-quantity" type="text" value={quantity || 1} onChange={onQuantityChangeHandler} />
      <button type="button" className="btn-plus" onClick={onPlusClickHandler}>
        {' + '}
      </button>
    </div>
  );
};

QuantityToggle.propTypes = {
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
};

export default QuantityToggle;
