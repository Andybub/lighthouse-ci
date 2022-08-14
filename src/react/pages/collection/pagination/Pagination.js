import './index.scss';
import {useEffect, useState, useCallback } from "react";
import PropTypes from 'prop-types';

const Pagination = (props) => {
  const {realPayload, setRealRequest} = props;
  // console.log('Pagination');
  // console.log('realPayload', realPayload);
  const page = realPayload ? realPayload.page : 1;
  const pageCount = realPayload ? realPayload.pageCount : 1;
  // console.log('page', page, 'pageCount', pageCount);

  const btnClass = 'btn gtm-page-button prevent-children';

  const [firstPage, setFirstPage] = useState(realPayload.page < 2);
  const [lastPage, setLastPage] = useState(realPayload.page === realPayload.pageCount);
  const [pagesToShow, setPagesToShow] = useState([]);

  const onClick = useCallback((e) => {
    setRealRequest(request => ({...request, page: parseInt(e.target.getAttribute('data-page'), 10)}));
  }, [setRealRequest]);

  useEffect(() => {
    // console.log('Pagination useEffect');
    setFirstPage(page < 2);
    setLastPage(page === pageCount);

    const maxBtnNum = 5;
    let start = Math.max(1, page - 2);
    if (pageCount - page <= 1) {
      start = Math.max(1, pageCount - (maxBtnNum - 1));
    }
    const end = Math.min(pageCount, start + (maxBtnNum - 1));
    const arr = [];
    for (let i = start; i <= end; i += 1) {
      arr.push(i);
    }
    setPagesToShow(arr);
  }, [realPayload]);

  return (
    <div className="pagination-container d-flex justify-content-end">
      <button onClick={onClick} type="button" className={`${btnClass} prev`} data-page={page - 1} disabled={firstPage}>«</button>
      {pagesToShow && pagesToShow.length > 0 && (
        pagesToShow.map(p => {
          return <button key={p} onClick={onClick} type="button" className={`${btnClass} ${page === p ? 'active' : ''}`} data-page={p}>{p}</button>
        })
      )}
      <button onClick={onClick} type="button" className={`${btnClass} next`} data-page={page + 1} disabled={lastPage}>»</button>
    </div>
  );
};

Pagination.propTypes = {
  realPayload: PropTypes.object.isRequired,
  setRealRequest: PropTypes.func.isRequired,
};

export default Pagination;