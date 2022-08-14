import { useState, useEffect } from 'react';

const useCartCount = (cart) => {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (cart) {
      const count = cart.items.reduce((prev, { handle, quantity }) => {
        return prev + (handle === 'personalized-rush-production-time' ? 0 : quantity);
      }, 0);
      setItemCount(count);
      document.querySelector('.cartCount').textContent = count;
    }
  }, [cart]);

  return itemCount;
};

export default useCartCount;
