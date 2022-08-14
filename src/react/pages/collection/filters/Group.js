import './Group.scss';
import {
  createSizeGroup,
  getSizeGroupNarrow,
  isColorFacet,
  isPriceFacet,
  isRatingFacet,
  isSizeFacet,
  isSizeLinen,
  isInStockFacet,
  isReviewsFacet,
  regulateFilterName,
} from '@/react/utils/FastSimon';
import { useState, useCallback, useMemo } from 'react';
import PriceRanger from '@/react/pages/collection/filters/PriceRanger';
import PriceSlider from '@/react/pages/collection/filters/PriceSlider';
import PropTypes from 'prop-types';

const Group = (props) => {
  // console.log('===== Group render! =====');
  // console.log(facet);
  const {
    priceMax,
    priceMin,
    mobileMode,
    facet,
    realPayload,
    setRealRequest,
    tempPayload,
    setTempRequest,
    defaultCollapse,
  } = props;
  // console.log('realPayload', realPayload);

  const { narrowBy, avoidPrefixList } = tempPayload || realPayload;
  // console.log('narrowBy', JSON.stringify(narrowBy));
  // console.log('avoidPrefixList', avoidPrefixList);

  let facetContents = facet[1];
  const facetName = facet[2];
  const facetNameLowercase = String(facetName).toLowerCase();
  // console.log('facetNameLowercase', facetNameLowercase);
  const isColor = isColorFacet(facetNameLowercase);
  const isPrice = isPriceFacet(facetNameLowercase);
  const isRating = isRatingFacet(facetNameLowercase);
  const isSize = isSizeFacet(facetNameLowercase);
  const isLinen = isSizeLinen(facetNameLowercase);
  const isInStock = isInStockFacet(facetNameLowercase);
  // const isReviews = isReviewsFacet(facetNameLowercase);
  const sizeGroup = {
    length: null,
    width: null,
    height: null,
  };
  // sorting
  if (isPrice) {
    // console.log('priceMax', priceMax);
    // console.log('priceMin', priceMin);
    facetContents.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  } else if (isRating) {
    facetContents.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
  } else if (isSize) {
    facetContents = createSizeGroup(facetNameLowercase, facetContents);
  } else if (isLinen) {
    // size:linen-10 x 10
    facetContents.sort((a, b) => {
      const a0 = a[0].replace('size:linen-', '');
      const b0 = b[0].replace('size:linen-', '');
      const newA = Number.isNaN(parseFloat(a0)) ? a0.toLowerCase() : parseFloat(a0);
      const newB = Number.isNaN(parseFloat(b0)) ? b0.toLowerCase() : parseFloat(b0);
      if (newA < newB) return -1;
      if (newA > newB) return 1;
      return 0;
    });
  } else if (isInStock) {
    // only display 'in stock'
    facetContents = facetContents.filter((content) => content[0] === 'True');
  } else {
    facetContents.sort((a, b) => {
      const newA = Number.isNaN(parseFloat(a[0])) ? a[0].toLowerCase() : parseFloat(a[0]);
      const newB = Number.isNaN(parseFloat(b[0])) ? b[0].toLowerCase() : parseFloat(b[0]);
      if (newA < newB) return -1;
      if (newA > newB) return 1;
      return 0;
    });
  }
  // hide if only ONE result
  facetContents = facetContents.filter((f) => f[1] > 1);
  // console.log('facetContents', facetContents);
  if (isSize) {
    if (facetNameLowercase.includes('length')) {
      sizeGroup.length = facetContents;
    } else if (facetNameLowercase.includes('width')) {
      sizeGroup.width = facetContents;
    } else if (facetNameLowercase.includes('height')) {
      sizeGroup.height = facetContents;
    }
    // console.log('sizeGroup', sizeGroup);
  }
  const isContentNeedMore = !isColor && !isPrice && !isRating && facetContents.length > 5;

  const [isCollapse, setIsCollapse] = useState(defaultCollapse);
  const [isDisplayFull, setIsDisplayFull] = useState(false);

  // console.log('facetContents', facetContents);
  // console.log('facetNameLowercase', facetNameLowercase);
  // console.log('isCollapse', isCollapse);
  // console.log('isContentNeedMore', isContentNeedMore);

  const liClassName = `mb-2 ${isColor ? 'col-3' : 'col-12'}`;

  const onToggleClick = useCallback(() => {
    // console.log('onToggleClick');
    setIsCollapse((prev) => !prev);
  }, [setIsCollapse]);

  const onChange = useCallback(
    (e) => {
      // console.log('Group onChange');
      // console.log(narrowBy);
      const input = e.target;
      const tagGroup = input.getAttribute('data-tag-group');
      const tagValue = input.getAttribute('data-tag-value');
      // console.log('tagGroup', tagGroup);
      // console.log('tagValue', tagValue);
      let tmpNarrowBy = [...narrowBy];
      if (mobileMode && tempPayload && tempPayload.narrowBy) {
        tmpNarrowBy = [...tempPayload.narrowBy];
      }
      // console.log([...tmpNarrowBy]);

      if (e.target.checked) {
        // add to narrow
        if (isSize) {
          const groupNarrow = getSizeGroupNarrow({ sizeGroup, group: tagGroup, value: tagValue });
          groupNarrow.forEach((narrow) => {
            tmpNarrowBy.push([tagGroup, narrow[0]]);
          });
        } else {
          tmpNarrowBy.push([tagGroup, tagValue]);
        }
      } else {
        // remove from narrow
        if (isSize) {
          const groupNarrow = getSizeGroupNarrow({ sizeGroup, group: tagGroup, value: tagValue });
          groupNarrow.forEach((narrow) => {
            tmpNarrowBy = tmpNarrowBy.filter((narrow2) => narrow2[0] !== tagGroup || narrow2[1] !== narrow[0]);
          });
        } else {
          tmpNarrowBy = tmpNarrowBy.filter((narrow) => narrow[0] !== tagGroup || narrow[1] !== tagValue);
        }
      }
      tmpNarrowBy = tmpNarrowBy.filter((narrow) => narrow[0] !== 'Price_from_to');
      // console.log(tmpNarrowBy);
      if (mobileMode) {
        // console.log('mobileMode', [...tmpNarrowBy]);
        setTempRequest((request) => ({ ...request, page: 1, narrowBy: tmpNarrowBy }));
      } else {
        // console.log('desktopMode', tmpNarrowBy);
        setRealRequest((request) => ({ ...request, page: 1, narrowBy: tmpNarrowBy }));
      }
    },
    [realPayload, setRealRequest, tempPayload, setTempRequest],
  );

  const onPriceRangerClick = useCallback(
    ([priceFrom, priceTo]) => {
      // console.log('onPriceSliderChange', value);
      const priceFromTo = `${priceFrom}-${priceTo}`;
      const currPriceFromTo = narrowBy.find((narrow) => narrow[0] === 'Price_from_to');
      if (currPriceFromTo && priceFromTo === currPriceFromTo[1]) {
        return;
      }
      let tmpNarrowBy = [...narrowBy];
      if (mobileMode && tempPayload && tempPayload.narrowBy) {
        tmpNarrowBy = [...tempPayload.narrowBy];
      }
      tmpNarrowBy = tmpNarrowBy.filter((narrow) => narrow[0] !== 'Price_from_to' && narrow[0] !== 'Price');
      tmpNarrowBy.push(['Price_from_to', priceFromTo]);
      // console.log(tmpNarrowBy);
      if (mobileMode) {
        setTempRequest((request) => ({ ...request, page: 1, narrowBy: tmpNarrowBy }));
      } else {
        setRealRequest((request) => ({ ...request, page: 1, narrowBy: tmpNarrowBy }));
      }
    },
    [narrowBy],
  );

  const defaultPriceValue = useMemo(() => {
    if (narrowBy && narrowBy.length > 0) {
      const priceNarrow = narrowBy.find((narrow) => narrow[0] === 'Price_from_to');
      if (priceNarrow) {
        const [from, to] = priceNarrow[1].split('-');
        return [from, to];
      }
    }
    return [priceMin, priceMax];
  }, [narrowBy]);

  const onPriceSliderChange = useCallback(
    ([priceFrom, priceTo]) => {
      // console.log('onPriceSliderChange', value);
      const priceFromTo = `${priceFrom}-${priceTo}`;
      const currPriceFromTo = narrowBy.find((narrow) => narrow[0] === 'Price_from_to');
      if (currPriceFromTo && priceFromTo === currPriceFromTo[1]) {
        return;
      }
      let tmpNarrowBy = [...narrowBy];
      if (mobileMode && tempPayload && tempPayload.narrowBy) {
        tmpNarrowBy = [...tempPayload.narrowBy];
      }
      tmpNarrowBy = tmpNarrowBy.filter((narrow) => narrow[0] !== 'Price_from_to' && narrow[0] !== 'Price');
      tmpNarrowBy.push(['Price_from_to', priceFromTo]);
      // console.log(tmpNarrowBy);
      if (mobileMode) {
        setTempRequest((request) => ({ ...request, page: 1, narrowBy: tmpNarrowBy }));
      } else {
        setRealRequest((request) => ({ ...request, page: 1, narrowBy: tmpNarrowBy }));
      }
    },
    [narrowBy],
  );

  return (
    <div className={`filter-group ${isCollapse ? 'collapse' : ''} position-relative`} data-tag-group={facetName}>
      <div onClick={onToggleClick} className="head d-flex justify-content-between">
        <span>{facetName}</span>
        <i className="icomoon icomoon-arrow-4" />
      </div>

      <div className="body row" data-display-full={!isContentNeedMore || isDisplayFull}>
        {isPrice && <PriceRanger priceMin={priceMin} priceMax={priceMax} onAfterClick={onPriceRangerClick} />}
        {isPrice && (
          <PriceSlider
            min={priceMin}
            max={priceMax}
            defaultValue={defaultPriceValue}
            onAfterChange={onPriceSliderChange}
          />
        )}
        {facetContents &&
          facetContents.length > 0 &&
          facetContents.map((fc) => {
            const value = fc[0];
            const count = fc[1];
            // console.log('=======================================');
            // console.log('value', value);
            // console.log('count', count);
            let name = regulateFilterName(fc[0], avoidPrefixList);
            if (isPrice) {
              const [min, max] = name.replaceAll('USD:', '').split('-');
              name = `$${parseInt(min, 10)} - $${parseInt(max, 10)}`;
            }
            const id = `category-${facetName}-${value}`;
            const labelClass = isColor ? 'color' : 'd-inline-flex justify-content-between align-items-center w-100';
            const checked = narrowBy.find((narrow) => {
              // console.log('narrow', narrow);
              const tagGroup = narrow[0].toLowerCase();
              const tagValue = String(narrow[1]).toLowerCase();
              // console.table({ tagGroup, facetNameLowercase, tagValue, value: String(value).toLowerCase() });
              if (isSize) {
                let targetSizeGroup;
                switch (tagGroup) {
                  case 'size length':
                    targetSizeGroup = sizeGroup.length;
                    break;
                  case 'size width':
                    targetSizeGroup = sizeGroup.width;
                    break;
                  case 'size height':
                    targetSizeGroup = sizeGroup.height;
                    break;
                  default:
                    break;
                }
                if (targetSizeGroup) {
                  // console.log('tagGroup', tagGroup);
                  // console.log('targetSizeGroup', targetSizeGroup);
                  // console.log('tagValue', tagValue);
                  // const match = targetSizeGroup.find((group) => group[2].find((sub) => sub[0].toLowerCase() === tagValue));
                  const match = targetSizeGroup.find((group, index) => {
                    // console.log(group, index);
                    return group[2].find((sub) => {
                      // console.log('sub[0]', sub[0].toLowerCase());
                      // console.log('tagValue', tagValue);
                      return sub[0].toLowerCase() === tagValue;
                    });
                  });
                  if (match) {
                    // console.log('match[0]', match[0]);
                    return match[0] === value;
                  }
                }
              } else if (tagGroup === 'price_from_to') {
                //
              } else {
                //
              }
              return tagGroup === facetNameLowercase && tagValue === String(value).toLowerCase();
            });
            return (
              <li key={id} className={`${liClassName} ${checked ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  onChange={onChange}
                  id={id}
                  className="filter-checkbox gtm-filter prevent-children"
                  data-tag-group={facetName}
                  data-tag-value={value}
                  data-tag-count={count}
                  defaultChecked={checked}
                />
                <label htmlFor={id} className={`${labelClass} mb-0`}>
                  {isColor && (
                    <img
                      className="w-100"
                      src={`${window.TW.filePath}isp-${value.toLowerCase()}-swatch.png`}
                      alt={value.toLowerCase()}
                    />
                  )}
                  <span className="value d-inline-block mr-1">{name}</span>
                  {!isColor && <span className="count">{count}</span>}
                </label>
              </li>
            );
          })}
      </div>
      {!isCollapse && isContentNeedMore && (
        <button
          onClick={() => {
            setIsDisplayFull((prev) => !prev);
          }}
          type="button"
          className="btn-more-toggle p-0 border-0"
          data-display-full={isDisplayFull}
        >
          <span className="txt mr-2">{isDisplayFull ? 'Show Less' : 'Show More'}</span>
          <i className="icomoon icomoon-arrow-4" />
        </button>
      )}
    </div>
  );
};

Group.propTypes = {
  priceMax: PropTypes.number,
  priceMin: PropTypes.number,
  mobileMode: PropTypes.bool.isRequired,
  facet: PropTypes.array.isRequired,
  realPayload: PropTypes.object.isRequired,
  setRealRequest: PropTypes.func.isRequired,
  tempPayload: PropTypes.object,
  setTempRequest: PropTypes.func.isRequired,
  defaultCollapse: PropTypes.bool.isRequired,
};

Group.defaultProps = {
  priceMax: 0,
  priceMin: 0,
  tempPayload: null,
};

export default Group;
