import { useState } from 'react';
import PropTypes from 'prop-types';
import './BISModal.scss';
import { isValidEmail } from '@/utils/Validator';
import { sendBIS } from '@/service/KlaviyoAPI';

const BISModal = ({ productId, variantId, title, image, price, regularPrice, customerEmail }) => {
  const [email, setEmail] = useState(customerEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInput = ({ target }) => {
    setEmail(target.value);
    setError('');
  };

  const handleSend = () => {
    if (loading) return;
    if (!isValidEmail(email)) {
      setError('Please enter a valid e-mail address.');
      return;
    }
    setLoading(true);
    sendBIS(email, productId, variantId)
      .then((result) => {
        console.log(result);
        setSuccess(true);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClose = () => {
    const { EventEmitter, CLOSE_KLAVIYO_BIS } = window.TW.main;
    EventEmitter.emit(CLOSE_KLAVIYO_BIS);
  };

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header justify-content-center">
          <p className="modal-title">Get in this item alert</p>
          <button type="button" className="close" aria-label="close" onClick={handleClose}>
            <i className="icomoon-close" />
          </button>
        </div>
        <div className="modal-body p-0">
          <div className="product-content d-flex no-gutters py-3">
            <div className="product-image col-3 pl-4">
              <img className="w-100" src={image} alt={title} />
            </div>
            <div className="product-info col-9 px-4">
              <p className="product-title">{title}</p>
              <div className="factory-price">
                <span className="price">${(price / 100).toFixed(2)}</span>
                <span className="regular-price">${(regularPrice / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
          {!success && (
            <div className="form-content d-flex flex-column align-items-center">
              <div className="form-group w-100">
                <input
                  type="email"
                  className={`form-control${!error ? '' : ' is-invalid'}`}
                  placeholder="Fill in your e-mail to get in stock alerts"
                  value={email}
                  onChange={handleInput}
                  disabled={loading}
                />
                {!!error && (
                  <div className="invalid-feedback">
                    <i className="icomoon-exclamation" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                className={`btn btn-primary btn-block${loading ? ' loading' : ''}`}
                onClick={handleSend}
                disabled={loading}
              >
                Notify Me
              </button>
            </div>
          )}
          {success && (
            <div className="success-content d-flex flex-column align-items-center">
              <p className="success-message">You’ll Be Notified When Available</p>
              <button type="button" className="btn btn-primary btn-block" onClick={handleClose}>
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

BISModal.propTypes = {
  productId: PropTypes.number.isRequired,
  variantId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  regularPrice: PropTypes.number.isRequired,
  customerEmail: PropTypes.string,
};

BISModal.defaultProps = {
  customerEmail: '',
};

export default BISModal;
