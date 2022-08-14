import './Bottom.scss';
import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';

const Bottom = (props) => {
  // console.log('Bottom');
  const { setFilterDisplay, setRealRequest, filterDisplay, tempPayload, realPayload, setRealPayload, tempRequest } =
    props;

  const [message, setMessage] = useState('...');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (tempRequest) {
      setMessage('...');
      setVisible(true);
      if (tempPayload) {
        if (tempPayload.isNoResults) {
          setMessage(0);
        } else {
          setMessage(tempPayload.totalResults);
        }
      }
    } else {
      setVisible(false);
      setMessage('...');
    }
  }, [tempRequest, tempPayload]);

  const onResetClick = useCallback(() => {
    setRealRequest((request) => ({ ...request, page: 1, narrowBy: [] }));
    setFilterDisplay(false);
  }, [setRealRequest]);

  const onApplyClick = useCallback(() => {
    // console.log('onApplyClick');
    // console.log({...tempPayload});
    setRealPayload(tempPayload);
    setFilterDisplay(false);
  }, [setRealPayload, tempPayload]);

  // TODO display when narrowBy different (realPayload.narrowBy vs tempPayload.narrowBy)
  // TODO hide with parent filters (filterDisplay)

  return (
    <div
      className="bottom-container d-flex justify-content-between position-fixed d-lg-none"
      data-visible={filterDisplay && visible}
    >
      <button onClick={onResetClick} type="button" className="btn-clear-all-filters col-5">
        Reset
      </button>
      <button onClick={onApplyClick} type="button" className="btn-apply-filters col-5">
        Apply <span>{`(${message})`}</span>
      </button>
    </div>
  );
};

Bottom.propTypes = {
  setFilterDisplay: PropTypes.func.isRequired,
  setRealRequest: PropTypes.func.isRequired,
  filterDisplay: PropTypes.bool.isRequired,
  tempPayload: PropTypes.object,
  realPayload: PropTypes.object,
  setRealPayload: PropTypes.func.isRequired,
  tempRequest: PropTypes.object,
};

Bottom.defaultProps = {
  tempPayload: null,
  realPayload: null,
  tempRequest: null,
};

export default Bottom;
