import './Groups.scss';
import { isPriceFacet, isPriceMaxFacet, isPriceMinFacet } from '@/react/utils/FastSimon';
import PropTypes from 'prop-types';
import Group from './Group';
import Selected from './Selected';

const isGroupWithChild = (facet) => facet[1].filter((f) => f[1] > 1).length > 0;

const Groups = (props) => {
  const { mobileMode, realPayload, setRealRequest, tempPayload, setTempRequest } = props;
  // console.log('Groups');
  const { facets, narrowBy } = realPayload;
  // console.log(facets);
  // console.log(narrowBy);
  // price
  const facetPriceMax = realPayload.facets.find((fc) => isPriceMaxFacet(fc[2]));
  const facetPriceMin = realPayload.facets.find((fc) => isPriceMinFacet(fc[2]));
  const priceMax = facetPriceMax ? facetPriceMax[1][0] : 0;
  const priceMin = facetPriceMin ? facetPriceMin[1][0] : 0;
  // console.log('priceMax', priceMax);
  // console.log('priceMin', priceMin);
  let groupAppended = 0;

  return (
    <div className="group-container">
      {narrowBy && narrowBy.length > 0 && <Selected realPayload={realPayload} setRealRequest={setRealRequest} />}
      {facets &&
        facets.length > 0 &&
        facets.map((facet) => {
          if (facet[1].length > 1) {
            groupAppended += 1;
            const isPriceMax = isPriceMaxFacet(facet[2]);
            const isPriceMin = isPriceMinFacet(facet[2]);
            if (!isPriceMax && !isPriceMin) {
              const isPrice = isPriceFacet(facet[2]);
              if (isPrice) {
                return (
                  <Group
                    key={facet[0]}
                    priceMax={priceMax}
                    priceMin={priceMin}
                    mobileMode={mobileMode}
                    facet={facet}
                    realPayload={realPayload}
                    setRealRequest={setRealRequest}
                    tempPayload={tempPayload}
                    setTempRequest={setTempRequest}
                    defaultCollapse={mobileMode ? groupAppended > 1 : groupAppended > 3}
                  />
                );
              }
              return (
                isGroupWithChild(facet) && (
                  <Group
                    key={facet[0]}
                    mobileMode={mobileMode}
                    facet={facet}
                    realPayload={realPayload}
                    setRealRequest={setRealRequest}
                    tempPayload={tempPayload}
                    setTempRequest={setTempRequest}
                    defaultCollapse={mobileMode ? groupAppended > 1 : groupAppended > 3}
                  />
                )
              );
            }
          }
          return null;
        })}
    </div>
  );
};

Groups.propTypes = {
  mobileMode: PropTypes.bool.isRequired,
  realPayload: PropTypes.object.isRequired,
  setRealRequest: PropTypes.func.isRequired,
  tempPayload: PropTypes.object,
  setTempRequest: PropTypes.func.isRequired,
};

Groups.defaultProps = {
  tempPayload: null,
};

export default Groups;
