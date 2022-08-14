export const fixPreOrderDateText = () => {
  document.querySelectorAll('.product__description__name').forEach((element) => {
    // console.log(element.textContent);
    const parent = element.parentElement;
    parent.querySelectorAll('.product__description__property').forEach((textElement) => {
      // console.log(textElement.textContent);
      if (textElement.textContent.includes('date_diff:')) {
        textElement.remove();
      } else if (textElement.textContent.includes('In Stock:')) {
        /* eslint no-param-reassign: ["error", { "props": false }] */
        textElement.textContent = textElement.textContent.replace('In Stock: ', '');
      }
    });
  });
};
