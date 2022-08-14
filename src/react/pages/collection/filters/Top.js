import './Top.scss';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

const Top = (props) => {
  const { setFilterDisplay, setTempRequest } = props;

  const onClick = useCallback(() => {
    setTempRequest(null);
    setFilterDisplay(false);
  }, [setTempRequest, setFilterDisplay]);

  return (
    <div className="top-container d-flex justify-content-between align-items-center d-lg-none pt-3 pb-3">
      <span className="font-weight-bold">Filter By :</span>
      <button type="button" className="btn-close border-0" onClick={onClick}>
        <i className="icomoon-close" />
      </button>
    </div>
  );
};

Top.propTypes = {
  setFilterDisplay: PropTypes.func.isRequired,
  setTempRequest: PropTypes.func.isRequired,
};

export default Top;
