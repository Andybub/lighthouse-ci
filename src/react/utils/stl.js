export const getVariant = (product, variantIndex=0) => {
  const {variants} = product;
  if (!variants || !variants.length) return false;
  return variants[variantIndex];
  // if (!variantId) return variants[0];
  // return variants.find(({ id }) => id === variantId);
};

export const enablePreorder = (product, variantIndex) => {
  const variant = getVariant(product, variantIndex);
  if (!variant) return false;
  const { inventory_policy: policy, inventory_quantity: quantity } = variant;
  return quantity < 1 && policy === 'continue';
};

export const underThreshold = (product, variantIndex) => {
  const variant = getVariant(product, variantIndex);
  if (!variant) return false;
  const { inventory_quantity: quantity, threshold } = variant;
  if (!threshold || quantity < 1) return false;
  return quantity < threshold;
};

export const availableMessage = (product, variantIndex) => {
  const variant = getVariant(product, variantIndex);
  if (!variant) return '';
  const { sold_out: soldOut } = variant;
  if (!soldOut || soldOut.indexOf('Preorder: Available') < 0) return '';
  return soldOut;
};

export const inventoryQuantity = (product, variantIndex) => {
  const variant = getVariant(product, variantIndex);
  if (!variant) return 0;
  return variant.inventory_quantity;
};
