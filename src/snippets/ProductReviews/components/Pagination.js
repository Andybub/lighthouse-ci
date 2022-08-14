import PropTypes from 'prop-types';
import useWindowDimensions from '@/react/hooks/useWindowDimensions';
import './Pagination.scss';

const Pagination = (props) => {
  const { currentPage, itemsPerPage, totalData, pagesLengthLimit, changePage } = props;
  const totalPages = Math.ceil(totalData / itemsPerPage);

  const { width: windowWidth } = useWindowDimensions();

  let pagesLengthLimitResponsive = null;
  if (windowWidth > 480) {
    pagesLengthLimitResponsive = pagesLengthLimit;
  } else if (pagesLengthLimit - 3) {
    pagesLengthLimitResponsive = pagesLengthLimit - 3;
  } else {
    pagesLengthLimitResponsive = pagesLengthLimit;
  }

  // console.log('currentPage', currentPage);
  // console.log('itemsPerPage', itemsPerPage);
  // console.log('totalData', totalData);
  // console.log('totalPages', totalPages);
  // console.log('pagesLengthLimitResponsive', pagesLengthLimitResponsive);

  const pageLength = totalPages > pagesLengthLimitResponsive ? pagesLengthLimitResponsive : totalPages;
  const pageLengthFront = pageLength % 2 === 0 ? pageLength / 2 - 1 : Math.floor(pageLength / 2);
  const pageLengthBack = pageLength % 2 === 0 ? pageLength / 2 : Math.floor(pageLength / 2);

  // console.log('pageLength', pageLength);
  // console.log('pageLengthFront', pageLengthFront);
  // console.log('pageLengthBack', pageLengthBack);

  let pageStart = currentPage - pageLengthFront > 0 ? currentPage - pageLengthFront : 1;
  let pageEnd = currentPage + pageLengthBack > totalPages ? totalPages : currentPage + pageLengthBack;

  // console.log('pageStart', pageStart);
  // console.log('pageEnd', pageEnd);

  const pageStartQuota = pageLengthFront - (currentPage - pageStart) || 0;
  const pageEndQuota = pageLengthBack - (pageEnd - currentPage) || 0;

  if (pageEnd + pageStartQuota > totalPages) {
    pageEnd = totalPages;
  } else {
    pageEnd += pageStartQuota;
  }

  if (pageStart - pageEndQuota > 0) {
    pageStart -= pageEndQuota;
  } else {
    pageStart = 1;
  }

  // console.log('pageStart', pageStart);
  // console.log('pageEnd', pageEnd);

  const pageArray = [];
  for (let i = pageStart; i <= pageEnd; i += 1) {
    pageArray.push(i);
  }

  return (
    <div id="product-review-pagination" className="mb-5">
      <button
        type="button"
        className="navigation navigation-prev"
        data-active={currentPage !== 1}
        onClick={() => changePage(currentPage - 1)}
      >
        <i className="icomoon-icon icomoon-arrow-3" />
      </button>
      <ul className="pagination-list">
        {totalPages > 0 &&
          pageArray.map((page) => {
            return (
              <li key={Math.random()} className="pagination-item">
                <button
                  type="button"
                  data-active={currentPage === page}
                  onClick={() => {
                    if (currentPage === page) return;
                    changePage(page);
                  }}
                >
                  {page}
                </button>
              </li>
            );
          })}
      </ul>
      <button
        type="button"
        className="navigation navigation-next"
        data-active={currentPage !== totalPages}
        onClick={() => changePage(currentPage + 1)}
      >
        <i className="icomoon-icon icomoon-arrow-3" />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  itemsPerPage: PropTypes.number,
  totalData: PropTypes.number,
  pagesLengthLimit: PropTypes.number,
  changePage: PropTypes.func,
};

Pagination.defaultProps = {
  currentPage: 1,
  itemsPerPage: 10,
  totalData: 0,
  pagesLengthLimit: 8,
  changePage: () => {},
};

export default Pagination;
