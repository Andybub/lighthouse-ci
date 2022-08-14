
export const applyCode = code => new Promise((resolve, reject) => {
  $.ajax(`/discount/${code}`)
  .done(resolve)
  .fail((jqXHR, textStatus, errorThrown) => {
    reject(errorThrown);
  });
});
