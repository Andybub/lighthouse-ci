import { useMemo, useCallback, useState } from 'react';
import './OrderBar.scss';
import { useModalContext } from '@/react/contexts/STLModal';

const orderOptions = [
  {
    label: 'Sort by Newest',
    value: 'new',
  },
  {
    label: 'Sort by Most Popular',
    value: 'score',
  },
];

const OrderBar = () => {
  const { setPage, order, setOrder } = useModalContext();
  const [showOptions, setShowOptions] = useState(false);

  const orderLabel = useMemo(() => {
    const option = orderOptions.find(({ value }) => value === order);
    if (option) return option.label;
    return 'Sort by Most Popular';
  }, [order]);

  const handleTriggerClick = useCallback(() => {
    setShowOptions(!showOptions);
  }, [showOptions]);

  const handleOptionClick = useCallback(
    (value) => {
      setShowOptions(false);
      if (value === order) return;
      setOrder(value);
      setPage(1);
    },
    [order, setOrder, setPage],
  );

  return (
    <div className="stl-order-container">
      <div className={`stl-order-trigger${showOptions ? ' show-options' : ''}`} onClick={handleTriggerClick}>
        {orderLabel}
        <span className="icomoon-arrow-2" />
      </div>
      <ul className={`stl-order-options${showOptions ? ' show-options' : ''}`}>
        {orderOptions.map(({ label, value }, index) => (
          <li
            className={`stl-order-option${value === order ? ' selected' : ''}`}
            onClick={() => handleOptionClick(value)}
            key={index}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderBar;
