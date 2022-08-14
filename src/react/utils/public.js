export const getHeaderHeight = () => {
  let result = null;

  const header = document.getElementsByTagName('header')[0];
  result = Math.round(header.getBoundingClientRect().height);

  return result;
};
