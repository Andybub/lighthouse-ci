import { changeCart, updateCart, getCart, clearCart } from '@/service/CartAPI';
import { getProductsById } from '@/service/ProductAPI';

export const CHANGE_LOADING = 'CHANGE_LOADING';
export const RECEIVE_CART = 'RECEIVE_CART';

// const changeLoading = (value) => ({
//   type: CHANGE_LOADING,
//   value,
// });

let productAdditionalData;

const patchItemsData = (items, additionalData) => {
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const product = additionalData.find((p) => p.id === item.product_id);
    if (product) {
      const variant = product.variants.find((v) => v.id === item.variant_id);
      item.variant_inventory_policy = variant.inventory_policy;
      item.variant_inventory_quantity = variant.inventory_quantity;
      item.variant_sold_out = variant.sold_out;
      item.variant_threshold = variant.threshold;
      item.collections = product.collections;
    } else {
      item.unavailable = true;
    }
  }
  return [...items];
};

const receiveCart = (cart) => ({
  type: RECEIVE_CART,
  cart: productAdditionalData ? { ...cart, items: patchItemsData(cart.items, productAdditionalData) } : cart,
});

export const actionIncreaseQuantity = ({ lineItemKey }) => {
  return (dispatch, getState) => {
    const { cart: currCart } = getState();
    const item = currCart.items.find((i) => i.key === lineItemKey);
    const { quantity } = item;
    if (item.product_type === 'Personalized') {
      const productionTimeItem = currCart.items.find((i) => i.product_id === 6552844959790);
      const productionTimeQuantity = productionTimeItem.quantity;
      const productionCostQuantity = parseInt(item.properties._production_cost_quantity, 10);
      updateCart({
        [lineItemKey]: quantity + 1,
        [productionTimeItem.key]: productionTimeQuantity + productionCostQuantity,
      }).then((cart) => {
        dispatch(receiveCart(cart));
        // dispatch(changeLoading(false));
      });
    } else {
      changeCart({ id: lineItemKey, quantity: quantity + 1 }).then((cart) => {
        dispatch(receiveCart(cart));
      });
    }
  };
};

export const actionDecreaseQuantity = ({ lineItemKey }) => {
  return (dispatch, getState) => {
    const { cart: currCart } = getState();
    const item = currCart.items.find((i) => i.key === lineItemKey);
    const { quantity } = item;
    if (item.product_type === 'Personalized') {
      const productionTimeItem = currCart.items.find((i) => i.product_id === 6552844959790);
      const productionTimeQuantity = productionTimeItem.quantity;
      const productionCostQuantity = parseInt(item.properties._production_cost_quantity, 10);
      updateCart({
        [lineItemKey]: quantity - 1,
        [productionTimeItem.key]: productionTimeQuantity - productionCostQuantity,
      }).then((cart) => {
        dispatch(receiveCart(cart));
        // dispatch(changeLoading(false));
      });
    } else {
      changeCart({ id: lineItemKey, quantity: quantity - 1 }).then((cart) => {
        dispatch(receiveCart(cart));
      });
    }
  };
};

export const actionUpdateQuantity = ({ lineItemKey, quantity: newQuantity }) => {
  return (dispatch, getState) => {
    const { cart: currCart } = getState();
    const item = currCart.items.find((i) => i.key === lineItemKey);
    const { quantity } = item;
    if (item.product_type === 'Personalized') {
      const productionTimeItem = currCart.items.find((i) => i.product_id === 6552844959790);
      const productionTimeQuantity = productionTimeItem.quantity;
      const productionCostQuantity = parseInt(item.properties._production_cost_quantity, 10);
      updateCart({
        [lineItemKey]: newQuantity,
        [productionTimeItem.key]: productionTimeQuantity + productionCostQuantity * (newQuantity - quantity),
      }).then((cart) => {
        dispatch(receiveCart(cart));
      });
    } else {
      changeCart({ id: lineItemKey, quantity: newQuantity }).then((cart) => {
        dispatch(receiveCart(cart));
      });
    }
  };
};

export const actionRemoveItem = ({ lineItemKey }) => {
  return (dispatch, getState) => {
    // dispatch(changeLoading(true));
    const { cart: currCart } = getState();
    const item = currCart.items.find((i) => i.key === lineItemKey);
    const productionTimeItem = currCart.items.find((i) => i.product_id === 6552844959790);
    if (item.product_type === 'Personalized' && productionTimeItem) {
      const productionTimeQuantity = productionTimeItem.quantity;
      const productionCostQuantity = parseInt(item.properties._production_cost_quantity, 10);
      updateCart({
        [lineItemKey]: 0,
        [productionTimeItem.key]: productionTimeQuantity - productionCostQuantity * item.quantity,
      }).then((cart) => {
        dispatch(receiveCart(cart));
        // dispatch(changeLoading(false));
      });
    } else {
      changeCart({ id: lineItemKey, quantity: 0 }).then((cart) => {
        dispatch(receiveCart(cart));
        // dispatch(changeLoading(false));
      });
    }
  };
};

export const actionClearCart = () => {
  return (dispatch) => {
    // dispatch(changeLoading(true));
    clearCart().then((cart) => {
      dispatch(receiveCart(cart));
      // dispatch(changeLoading(false));
    });
  };
};

const updateCartPreOrderInfo = (cart) => {
  // skip Personalized item
  const needUpdate = cart.items
    .filter((item) => item.product_type !== 'Personalized')
    .map((item) => {
      const { key, properties, variant_sold_out: variantSoldOut } = item;
      const isPreOrder = variantSoldOut.includes('Preorder: Available on ');
      if (isPreOrder) {
        const date = variantSoldOut.replace('Preorder: Available on ', '');
        const newProperties = { ...properties };
        newProperties.date_diff = date;
        newProperties['In Stock'] = `Preorder: Available on ${date}`;
        return { id: key, properties: newProperties };
      }
      return null;
    })
    .filter((obj) => Boolean(obj));

  let promises;
  if (needUpdate.length > 0) {
    promises = Promise.resolve();
    needUpdate.forEach(({ id, properties }) => {
      promises = promises.then(() => {
        return changeCart({ id, properties });
      });
    });
  } else {
    promises = Promise.resolve(cart);
  }
  return promises;
};

export const fetchCart = () => {
  return (dispatch, getState, api) => {
    // dispatch(changeLoading(true));
    getCart()
      .then((cart) => {
        dispatch(receiveCart(cart));
        return getProductsById(
          cart.items.map((item) => item.product_id),
          'cart',
        );
      })
      .then((response) => {
        productAdditionalData = response;
        dispatch(receiveCart(getState().cart));
        return Promise.resolve();
      })
      .then(() => {
        return updateCartPreOrderInfo(getState().cart);
      })
      .then((cart) => {
        dispatch(receiveCart(cart));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        // dispatch(changeLoading(false));
      });
  };
};
