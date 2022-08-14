import PropTypes from 'prop-types';
import './CKModal.scss';

const CKModal = ({ customer, keepCart, loadCart, mergeCarts, closeModal }) => {
  return (
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header pt-4 px-4">
          <p className="modal-title">Hi {customer}, </p>
          <button type="button" className="close" aria-label="close" onClick={closeModal}>
            <i className="icomoon-close" />
          </button>
        </div>
        <div className="modal-body pt-4 px-4">
          <p>We&apos;ve noticed that you have items in your cart but have a saved cart from your last login.</p>
          <p>What would you like to do?</p>
          <ul className="row">
            <li className="col-12 col-md-4">
              <button type="button" className="btn btn-primary btn-block btn-rounded rounded-pill" onClick={keepCart}>
                Keep the cart
              </button>
            </li>
            <li className="col-12 col-md-4 mt-3 mt-md-0">
              <button type="button" className="btn btn-primary btn-block btn-rounded rounded-pill" onClick={loadCart}>
                Load saved cart
              </button>
            </li>
            <li className="col-12 col-md-4 mt-3 mt-md-0">
              <button type="button" className="btn btn-primary btn-block btn-rounded rounded-pill" onClick={mergeCarts}>
                Merge carts
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

CKModal.propTypes = {
  customer: PropTypes.string.isRequired,
  keepCart: PropTypes.func.isRequired,
  loadCart: PropTypes.func.isRequired,
  mergeCarts: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default CKModal;
