import './index.scss';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

const NoResult = (props) => {
  const { setRealRequest } = props;

  const onClick = useCallback(() => {
    setRealRequest((request) => ({ ...request, narrowBy: [], page: 1 }));
  }, [setRealRequest]);

  return (
    <div className="no-result-container d-flex align-items-center flex-wrap">
      <span>No results found. Showing top popular products you might want to consider...</span>
      <button onClick={onClick} type="button" className="btn-reset-filters d-none d-lg-inline-block">
        Reset Filters
      </button>
      <p className="txt-popular-products d-lg-none w-100 text-center mb-0">
        Top products you might want to consider...
      </p>
    </div>
  );
};

NoResult.propTypes = {
  setRealRequest: PropTypes.func.isRequired,
};

export default NoResult;
