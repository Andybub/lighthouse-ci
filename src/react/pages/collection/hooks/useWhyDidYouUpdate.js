import { useEffect, useRef } from 'react';
// https://usehooks.com/
// https://github.com/devhubapp/devhub/blob/master/packages/components/src/hooks/use-why-did-you-update.ts

const useWhyDidYouUpdate = (name, props) => {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = useRef();
  useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      // Use this object to keep track of changed props
      const changesObj = {};
      // Iterate through keys
      allKeys.forEach((key) => {
        // If previous is different from current
        if (previousProps.current[key] !== props[key]) {
          // Add to changesObj
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });
      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log('[why-did-you-update]', name, changesObj);
      }
    }
    // Finally update previousProps with current props for next hook call
    previousProps.current = props;
  });
};

/*
const useWhyDidYouUpdate = (name, props, { onChangeFound, onNoChangeFound } = {}) => {
  console.log('useWhyDidYouUpdate');
  console.log(props);
  const latestProps = useRef(props);
  useEffect(() => {
    const allKeys = Object.keys({ ...latestProps.current, ...props });
    const changesObj = {};
    allKeys.forEach((key) => {
      if (latestProps.current[key] !== props[key]) {
        changesObj[key] = {
          from: latestProps.current[key],
          to: props[key],
          changedKeys:
            props[key] && typeof props[key] === 'object'
              ? Object.keys(latestProps.current[key])
                  .map((k) => (latestProps.current[key][k] === props[key][k] ? '' : k))
                  .filter(Boolean)
              : undefined,
          isDeepEqual: Object.is(latestProps.current[key], props[key]),
        };
      }
    });
    if (Object.keys(changesObj).length) {
      if (onChangeFound) {
        onChangeFound({ changesObj });
      } else {
        // eslint-disable-next-line no-console
        console.log('[why-did-you-update]', name, {
          changes: JSON.parse(JSON.stringify(changesObj)),
          props: { from: latestProps.current, to: props },
        });
      }
    } else if (onNoChangeFound) {
      onNoChangeFound();
    }
    latestProps.current = props;
  });
};
*/

export default useWhyDidYouUpdate;
