export const getInventoryType = (quantity, policy, threshold, soldOut, unavailable) => {
  let type = null;

  if (unavailable) {
    type = 'soldOut';
  } else if (quantity < 1) {
    if (policy === 'continue' && soldOut?.includes('Preorder: Available on')) {
      type = 'preOrder';
    } else {
      type = 'soldOut'
    }
  } else if (threshold > 0 && quantity < threshold) {
    type = 'almostGone';
  } else {
    type = 'normal';
  }
  return type;
}