export const getProductsByQuery = (query, view = 'prod-info') => {
  const url = `/search?view=${view}&q=${query}`;
  return new Promise((resolve, reject) => {
    $.ajax(url, {
      type: 'GET',
      dataType: 'json',
    })
      .done((data) => resolve(data))
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(url, textStatus, errorThrown);
        reject(errorThrown);
      });
  });
};

export const getProductsById = (idArray, view = 'prod-info') => {
  const query = idArray.map((id) => `id:${id}`).join(' OR ');
  return getProductsByQuery(query, view);
};

export const getProductsByHandle = (handleArray, view = 'prod-info') => {
  const query = handleArray.map((handle) => `handle:${handle}`).join(' OR ');
  return getProductsByQuery(query, view);
};
