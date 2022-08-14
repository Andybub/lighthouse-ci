import './BtnSizeChart.scss';
import { memo } from 'react';

const BtnSizeChart = () => {
  return (
    <button
      type="button"
      className="btn-size-chart d-inline-block rounded-pill"
      data-toggle="modal"
      data-target="#size-chart-modal"
    >
      Size Chart
      <i className="icomoon icomoon-size-chart" />
    </button>
  );
};

export default memo(BtnSizeChart);
