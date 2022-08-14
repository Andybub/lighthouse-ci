const defaultSettings = {
  type: 'POST',
  dataType: 'json',
};

const callCartApi = (url, settings) =>
  new Promise((resolve, reject) => {
    $.ajax(url, { ...defaultSettings, ...settings })
      .done((data) => resolve(data))
      .fail((jqXHR, textStatus, errorThrown) => reject(errorThrown));
  });

export const getCart = () => callCartApi('/cart.js', { type: 'GET' });

export const addCart = (items) => callCartApi('/cart/add.js', { data: { items } });

export const updateCart = (updates) => callCartApi('/cart/update.js', { data: { updates } });

export const updateCartData = (data) => callCartApi('/cart/update.js', { data });

export const changeCart = (data) => callCartApi('/cart/change.js', { data });

export const clearCart = () => callCartApi('/cart/clear.js');
