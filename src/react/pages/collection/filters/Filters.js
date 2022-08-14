import './Filters.scss';
import PropTypes from 'prop-types';
// import RenderTip from '@/react/utils/RenderTip';
import { useEffect, useRef } from 'react';
import Top from './Top';
import Groups from './Groups';
import Bottom from './Bottom';

const Filters = (props) => {
  // console.log('Filters');
  const {
    mobileMode,
    filterDisplay,
    setFilterDisplay,
    realPayload,
    setRealRequest,
    setRealPayload,
    tempPayload,
    setTempRequest,
    tempRequest,
  } = props;
  // console.log('narrowBy', JSON.stringify(realPayload.narrowBy));

  const domRef = useRef(null);

  useEffect(() => {
    if (filterDisplay) {
      domRef.current.scrollTop = 0;
    }
  }, [filterDisplay]);

  return (
    <div
      className={`filter-container ${realPayload.isNoResults ? 'd-none' : 'col-12 col-lg-3'}`}
      data-visible={filterDisplay}
    >
      {/* <RenderTip/> */}
      <div
        className="block position-absolute d-lg-none"
        onClick={() => {
          // TODO reset filters checkbox status
          setTempRequest(null);
          setFilterDisplay(false);
        }}
      />
      <div className="filter container position-relative" ref={domRef}>
        <Top setFilterDisplay={setFilterDisplay} setTempRequest={setTempRequest} />
        {realPayload.facets && realPayload.facets.length > 0 && (
          <Groups
            mobileMode={mobileMode}
            realPayload={realPayload}
            setRealRequest={setRealRequest}
            tempPayload={tempPayload}
            setTempRequest={setTempRequest}
          />
        )}
        <Bottom
          filterDisplay={filterDisplay}
          setFilterDisplay={setFilterDisplay}
          realPayload={realPayload}
          setRealPayload={setRealPayload}
          setRealRequest={setRealRequest}
          tempPayload={tempPayload}
          tempRequest={tempRequest}
        />
      </div>
    </div>
  );
};

Filters.propTypes = {
  mobileMode: PropTypes.bool.isRequired,
  filterDisplay: PropTypes.bool.isRequired,
  setFilterDisplay: PropTypes.func.isRequired,
  realPayload: PropTypes.object,
  setRealRequest: PropTypes.func.isRequired,
  setRealPayload: PropTypes.func.isRequired,
  tempPayload: PropTypes.object,
  setTempRequest: PropTypes.func.isRequired,
  tempRequest: PropTypes.object,
};

Filters.defaultProps = {
  tempPayload: null,
  realPayload: null,
  tempRequest: null,
};

export default Filters;
