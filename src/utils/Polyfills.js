export const requestIdleCallback = (callback, options) => {
  if (window.requestIdleCallback) return window.requestIdleCallback(callback, options);
  const start = Date.now();
  return setTimeout(
    () =>
      callback({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        },
      }),
    1,
  );
};

export const cancelIdleCallback = (id) => {
  if (window.cancelIdleCallback) window.cancelIdleCallback(id);
  else clearTimeout(id);
};
