import './index.scss';
import PropTypes from 'prop-types';
import { isPriceFacet, isPriceFromToNarrow, regulateFilterName } from '@/react/utils/FastSimon';
import { useCallback } from 'react';

const Narrow = (props) => {
  // console.log('Narrow');
  const { realPayload, setRealRequest } = props;
  // console.log('realPayload', realPayload);
  const { narrowBy, avoidPrefixList } = realPayload;
  // console.log('narrowBy', JSON.stringify(narrowBy));
  const onRemoveTagClick = useCallback(
    (e) => {
      // console.log(e.target);
      // console.log(narrowBy);
      const group = e.target.getAttribute('data-tag-group');
      const value = e.target.getAttribute('data-tag-value');
      // console.log(group, value);
      const afterRemove = narrowBy.filter((narrow) => !(narrow[0] === group && narrow[1] === value));
      // console.log(afterRemove);
      setRealRequest((request) => ({ ...request, page: 1, narrowBy: afterRemove }));
    },
    [narrowBy, setRealRequest],
  );

  const onClearAllClick = useCallback(() => {
    setRealRequest((request) => ({ ...request, narrowBy: [], page: 1 }));
  }, [setRealRequest]);

  return (
    <div className="narrow-container d-flex align-items-start flex-wrap d-lg-none">
      {narrowBy &&
        narrowBy.length > 0 &&
        narrowBy.map((n) => {
          const [tagGroup, tagValue] = n;
          const key = `${tagGroup}-${tagValue}`;
          let name = regulateFilterName(n[1], avoidPrefixList);
          const isPrice = isPriceFacet(tagGroup);
          // console.log('isPrice', isPrice);
          const isPriceFromTo = isPriceFromToNarrow(tagGroup);
          // console.log('isPriceFromTo', isPriceFromTo);
          if (isPrice) {
            const [min, max] = name.replaceAll('USD:', '').split('-');
            name = `$${parseInt(min, 10)} - $${parseInt(max, 10)}`;
          } else if (isPriceFromTo) {
            const [min, max] = name.split('-');
            name = `$${parseInt(min, 10)} - $${parseInt(max, 10)}`;
          }
          return (
            <button
              key={key}
              onClick={onRemoveTagClick}
              type="button"
              className="btn-remove-tag d-flex align-items-center prevent-children"
              data-tag-group={tagGroup}
              data-tag-value={tagValue}
            >
              {name}
              <i className="icomoon-close ml-2" />
            </button>
          );
        })}
      {narrowBy && narrowBy.length > 0 && (
        <button onClick={onClearAllClick} type="button" className="btn-remove-all-tag">
          Clear all
        </button>
      )}
    </div>
  );
};

Narrow.propTypes = {
  realPayload: PropTypes.object.isRequired,
  setRealRequest: PropTypes.func.isRequired,
};

export default Narrow;
