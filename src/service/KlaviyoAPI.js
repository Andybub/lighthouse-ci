const sendKlaviyoAPI = (path, data) =>
  new Promise((resolve, reject) => {
    $.ajax(`https://d4cprf8xhb.execute-api.us-east-2.amazonaws.com/v1${path}`, {
      type: 'POST',
      dataType: 'json',
      cache: false,
      data,
    })
      .done((result) => {
        console.info('Klaviyo API', result);
        resolve(result);
      })
      .fail((xhr, status, error) => {
        console.error('Klaviyo API', status, error);
        reject(error);
      });
  });

export const sendSubscribe = (email) => sendKlaviyoAPI('/bis/efmt', { email });

export const sendBlog = (email) => sendKlaviyoAPI('/bis/efmt', { email });

export const sendBIS = (email, product, variant) => {
  const data = { email, product, variant };
  return sendKlaviyoAPI('/bis/efmt', data);
};
