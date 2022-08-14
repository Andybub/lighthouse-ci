export const getBadge = () => {
  // console.log('getBadge');
  const dataDOM = document.getElementById('tw-discount-badge-settings-json');
  if (dataDOM) {
    try {
      const data = JSON.parse(dataDOM.innerHTML);
      if (data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('initDiscountBadge error', e);
    }
  }
  return [];
}