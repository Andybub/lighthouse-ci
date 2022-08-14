import './Selected.scss';
import { isPriceFacet, isPriceFromToNarrow, regulateFilterName } from '@/react/utils/FastSimon';
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const Selected = (props) => {
  // console.log('Selected');
  const { realPayload, setRealRequest } = props;
  const { narrowBy, avoidPrefixList } = realPayload;
  // console.log('Selected narrowBy', narrowBy);

  const [isCollapse, setIsCollapse] = useState(false);

  const onToggleClick = useCallback(() => {
    setIsCollapse((prev) => !prev);
  }, [setIsCollapse]);

  const onRemoveTagClick = useCallback(
    (e) => {
      // console.log(e.target);
      // console.log(narrowBy);
      let group = e.target.getAttribute('data-tag-group');
      const value = e.target.getAttribute('data-tag-value');
      if (group === 'Price Range') {
        group = 'Price_from_to';
      }
      // console.log('group', group, 'value', value);
      // const afterRemove = narrowBy.filter((narrow) => !(narrow[0] === group && narrow[1] === value));
      const afterRemove = narrowBy.filter((narrow) => {
        // console.log('narrow', narrow);
        return !(narrow[0] === group && narrow[1] === value);
      });
      // console.log('afterRemove', afterRemove);
      setRealRequest((request) => ({ ...request, page: 1, narrowBy: afterRemove }));
    },
    [narrowBy, setRealRequest],
  );

  const onClearAllClick = useCallback(() => {
    setRealRequest((request) => ({ ...request, page: 1, narrowBy: [] }));
  }, [setRealRequest]);

  return (
    <div className={`selected-filter-container filter-group d-none d-lg-block ${isCollapse ? 'collapse' : ''}`}>
      <div onClick={onToggleClick} className="head d-flex justify-content-between">
        <span>Filter By :</span>
        <i className="icomoon icomoon-arrow-4" />
      </div>
      <div className="body">
        {narrowBy &&
          narrowBy.length > 0 &&
          narrowBy.map((n) => {
            const [tagGroup, tagValue] = n;
            const key = `${tagGroup}-${tagValue}`;
            // console.log('key', key);
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
                className="btn-remove-tag prevent-children"
                data-tag-group={tagGroup}
                data-tag-value={tagValue}
              >
                {name}
                <i className="icomoon-close" />
              </button>
            );
          })}
        <button
          onClick={onClearAllClick}
          type="button"
          className="btn-remove-all-tag border-0 rounded-0 m-0 w-100 justify-content-start"
        >
          Clear all
        </button>
      </div>
    </div>
  );
};

Selected.propTypes = {
  realPayload: PropTypes.object.isRequired,
  setRealRequest: PropTypes.func.isRequired,
};

export default Selected;
