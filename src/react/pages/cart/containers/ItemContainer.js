import { useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  actionIncreaseQuantity,
  actionDecreaseQuantity,
  actionUpdateQuantity,
  actionRemoveItem,
} from '@/react/pages/cart/actions';
import Item from '@/react/pages/cart/components/Item';

const ItemContainer = () => {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const atIncreaseQuantity = useCallback(
    (data) => {
      dispatch(actionIncreaseQuantity(data));
    },
    [dispatch],
  );

  const atDecreaseQuantity = useCallback(
    (data) => {
      dispatch(actionDecreaseQuantity(data));
    },
    [dispatch],
  );

  const atUpdateQuantity = useCallback(
    (data) => {
      dispatch(actionUpdateQuantity(data));
    },
    [dispatch],
  );

  const atRemoveItem = useCallback(
    (data) => {
      dispatch(actionRemoveItem(data));
    },
    [dispatch],
  );

  if (items && items.length > 0) {
    return items.map((item) => (
      <Item
        key={item.key}
        item={item}
        onIncreaseQuantity={atIncreaseQuantity}
        onDecreaseQuantity={atDecreaseQuantity}
        onUpdateQuantity={atUpdateQuantity}
        onRemoveItem={atRemoveItem}
      />
    ));
  }
  return <div />;
};

ItemContainer.propTypes = {};

ItemContainer.defaultProps = {};

export default memo(ItemContainer);
