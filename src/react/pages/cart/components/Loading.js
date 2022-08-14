import { memo } from 'react';
import { useSelector } from 'react-redux';

const Loading = () => {
  const { common } = useSelector((state) => state);
  // console.log('common.loading', common.loading);

  return <div className={`loading-container text-center ${common.loading ? '' : 'd-none'}`}>loading</div>;
};

export default memo(Loading);
