import './MotivatorMessage.scss';
import PropTypes from 'prop-types';

const MotivatorMessage = (props) => {
  const { cart } = props;
  // TODO need test
  const onlyCustomize = !cart.items.find(
    (item) => item.product_id !== 6552844959790 && item.product_type !== 'Personalized',
  );

  return (
    <div className="motivator-message text-center">
      <ul className="message-list">
        <li className="free-shipping" data-subtotal={cart.total_price}>
          {cart.total_price > 4900 ? (
            <p className="over-threshold">
              <i className="icomoon-check" /> Free Shipping
            </p>
          ) : (
            <p className="under-threshold">
              Only <span className="price-diff">{`$${((4900 - cart.total_price) / 100).toFixed(2)}`}</span> until Free
              Shipping
            </p>
          )}
        </li>
        {!onlyCustomize && (
          <li className="free-returns">
            <p>
              <i className="icomoon-check" /> Flexible Return 180 Days
            </p>
          </li>
        )}
      </ul>
    </div>
  );
};

MotivatorMessage.propTypes = {
  cart: PropTypes.object.isRequired,
  maxLimit: PropTypes.number,
};

MotivatorMessage.defaultProps = {
  maxLimit: 0,
};

export default MotivatorMessage;
