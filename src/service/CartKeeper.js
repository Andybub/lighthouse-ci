export const setPersistentCart = (customerId, cartData) =>
  new Promise((resolve, reject) => {
    const { token, total_price: totalPrice } = cartData;
    $.ajax('https://cart-keeper.boldapps.net/front_end/customer_api/create_update_persistent_cart', {
      method: 'POST',
      dataType: 'json',
      data: {
        customer_id: customerId,
        shop: window.Shopify.shop,
        cart_token: token,
        cart_total: totalPrice / 100,
        user_agent: navigator.userAgent,
      },
    })
      .done((response) => {
        console.log('Success from the Cart Keeper app', response);
        resolve(response);
      })
      .fail((error) => {
        console.warn('Error from the Cart Keeper app', error);
        reject(error);
      });
  });

export const getPersistentCart = (customerId) =>
  new Promise((resolve, reject) => {
    $.ajax('https://cart-keeper.boldapps.net/front_end/customer_api/get_persistent_cart', {
      method: 'POST',
      dataType: 'json',
      data: {
        customer_id: customerId,
        shop: window.Shopify.shop,
      },
    })
      .done((response) => {
        const { status, message } = response;
        try {
          const messageData = JSON.parse(message);
          if (status !== 'Found') resolve(status);
          else {
            const { cart_token: cartToken, cart_json: cartJson } = messageData;
            resolve({ cartToken, cartJson });
          }
        } catch (err) {
          console.warn('Error returned from Saved Cart app:', message);
          reject(err);
        }
      })
      .fail((error) => {
        console.warn('Error returned from Saved Cart app:', error);
        reject(error);
      });
  });
