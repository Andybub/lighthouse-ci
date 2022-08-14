export const setCookie = (key, value, expires) => {
  document.cookie = `${key}=${value}; expires=${expires}; path=/`;
};

export const setCookieLimitDays = (key, value, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  setCookie(key, value, date.toUTCString());
};

export const setCookieNeverExpire = (key, value) => {
  const date = new Date(Date.UTC(9999, 11, 31, 23, 59, 59));
  setCookie(key, value, date.toUTCString());
};

export const setCookieExpired = (key) => {
  const date = new Date(Date.UTC(1970, 0, 1, 0, 0, 0));
  setCookie(key, '', date.toUTCString());
};

export const getCookie = (key, withoutValue = false) => {
  const startsWithKey = `${key}${withoutValue ? '' : '='}`;
  return document.cookie.split('; ').find((row) => row.startsWith(startsWithKey));
};

export const getCookieValue = (key) => {
  const row = getCookie(key);
  if (!row) return row;
  const [, value] = row.split('=');
  return value;
};
