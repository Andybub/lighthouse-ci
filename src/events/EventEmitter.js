/**
 * Events Map
 * key > event name (String)
 * value > Listener Set (Object { callback, scope, once })
 * @type {Map<string, Set>}
 */
export const eventMap = new Map();

/**
 * addEventListener
 * @param {string} event - event name
 * @param {callback} callback - event handler
 * @param {thisArg} scope - this argument (not required)
 * @param {boolean} once - only trigger once (default: false)
 */
export const on = (event, callback, scope, once = false) => {
  const listener = { callback, scope, once };
  if (eventMap.has(event)) eventMap.get(event).add(listener);
  else eventMap.set(event, new Set([listener]));
};

/**
 * removeEventListener
 * @param {string} event - event name
 * @param {callback} callback - event handler (not required)
 */
export const off = (event, callback) => {
  if (!eventMap.has(event)) return;
  const listenerSet = eventMap.get(event);
  if (!callback) {
    listenerSet.clear();
    eventMap.delete(event);
    return;
  }
  listenerSet.forEach((listener) => {
    if (listener.callback === callback) listenerSet.delete(listener);
  });
};

/**
 * addEventListener but ONCE only
 * @param {string} event - event name
 * @param {callback} callback - event handler
 * @param {thisArg} scope - this argument (not required)
 */
export const once = (event, callback, scope) => {
  on(event, callback, scope, true);
};

/**
 * dispatchEvent
 * @param {string} event
 * @param {parameters} args
 */
export const emit = (event, ...args) => {
  if (!eventMap.has(event)) return;
  const listenerSet = eventMap.get(event);
  listenerSet.forEach((listener) => {
    const { callback, scope, once: isOnce } = listener;
    callback.apply(scope, args);
    if (isOnce) listenerSet.delete(listener);
  });
};
