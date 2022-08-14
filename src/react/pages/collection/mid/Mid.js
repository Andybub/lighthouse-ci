import './Mid.scss';
import { sortByMapping } from '@/react/utils/FastSimon';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

const SortBy = (props) => {
  const { realPayload, setRealRequest } = props;
  // console.log('SortBy');
  // console.log('realPayload', realPayload);
  // fix fast simon typo
  const sortBy = realPayload && realPayload.sortBy !== 'relevency' ? realPayload.sortBy : 'relevancy';
  // console.log('sortBy', sortBy);
  // console.log(sortByMapping.find(s => s.key === sortBy));
  const { key, value } = sortByMapping.find((s) => s.key === sortBy);
  // console.log('key', key, 'value', value);

  const onChange = useCallback(
    (e) => {
      setRealRequest((request) => ({ ...request, sortBy: e.target.value, page: 1 }));
    },
    [setRealRequest],
  );

  return (
    <div className="sort-by position-absolute d-flex align-items-center text-nowrap mr-3">
      {/* <span className="text d-none d-lg-inline mr-2">Sort by : </span> */}
      <div className="select-container position-relative">
        <select name="sortBy" id="select-sort-by" className="m-0" onChange={onChange} value={key}>
          {sortByMapping.map((s) => {
            return (
              <option key={s.key} value={s.key}>
                {s.value}
              </option>
            );
          })}
        </select>
        <p className="selected-text position-absolute pointer-event w-100 m-0">{value}</p>
        <span className="ico position-absolute">
          <i className="fkt-angle-down" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
};

SortBy.propTypes = {
  realPayload: PropTypes.object.isRequired,
  setRealRequest: PropTypes.func.isRequired,
};

const Mid = (props) => {
  const { realPayload, setRealRequest, setFilterDisplay } = props;
  // console.log('Mid')
  // console.log('realPayload', realPayload);
  const totalResults = realPayload ? realPayload.totalResults : 0;
  // const sortBy = realPayload ? realPayload.sortBy : '';
  // console.log(sizeChart, totalResults, sortBy);

  const onClick = useCallback(() => {
    setFilterDisplay(true);
  }, [setFilterDisplay]);

  return (
    <div className="mid-container row position-sticky align-items-center p-4">
      {totalResults > 1 && (
        <div className="filter-by filterMobile d-lg-none" onClick={onClick}>
          <span className="ico">
            <i className="fkt-bars" aria-hidden="true" />
          </span>
          <span className="layered_subtitle">Filter</span>
        </div>
      )}
      <p className="count m-0">{`${totalResults} results`}</p>
      {totalResults > 1 && <SortBy realPayload={realPayload} setRealRequest={setRealRequest} />}
    </div>
  );
};

Mid.propTypes = {
  realPayload: PropTypes.object.isRequired,
  setRealRequest: PropTypes.func.isRequired,
  setFilterDisplay: PropTypes.func.isRequired,
};

// realPayload={realPayload} setRealRequest={setRealRequest} setFilterDisplay={setFilterDisplay}

export default Mid;
