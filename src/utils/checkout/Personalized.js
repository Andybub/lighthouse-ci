// TODO
export const fixPersonalizedProductsPrice = () => {
  // what if discount
};

// TODO
export const fixPersonalizedProductsText = () => {
  document.querySelectorAll('.product__description__name').forEach((element) => {
    if (element.textContent.includes('Personalized')) {
      const parent = element.parentElement;
      parent.querySelectorAll('.product__description__property').forEach((textElement) => {
        /* eslint no-param-reassign: ["error", { "props": false }] */
        textElement.textContent = textElement.textContent.replace('Choose ', '').replace('Enter ', '');
      });
    }
  });
};
