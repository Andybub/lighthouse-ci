import PropTypes from 'prop-types';
import TitleBlock from './TitleBlock';
import BannerBlock from './BannerBlock';
import GridProductsBlock from './GridProductsBlock';
import BodyAndFootnoteBlock from './BodyAndFootnoteBlock';
import './WeeklyPromotion.scss';

const WeeklyPromotionApp = ({ time, data }) => {
  console.log(time, data);

  return (
    <div className="weekly-promotion-root">
      <div className="react-weekly-promotion d-flex flex-column flex-wrap pt-3">
        {data.map((item, index) => {
          const { type, settings, gridItems } = item;
          const key = `${type}_${index}`;
          switch (type) {
            case 'title':
              return <TitleBlock title={settings} time={time} key={key} />;
            case 'banner':
              return <BannerBlock banner={settings} key={key} />;
            case 'grid_collection':
            case 'grid_products':
              return <GridProductsBlock gridType={type} gridCollection={settings} gridItems={gridItems} key={key} />;
            case 'body_footnote':
              return <BodyAndFootnoteBlock bodyFootnote={settings} key={key} />;
            default:
              break;
          }
          return '';
        })}
      </div>
    </div>
  );
};

WeeklyPromotionApp.propTypes = {
  time: PropTypes.shape({
    contentStart: PropTypes.number.isRequired,
    contentEnd: PropTypes.number.isRequired,
  }).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      settings: PropTypes.object.isRequired,
      gridItems: PropTypes.array,
    }),
  ).isRequired,
};

export default WeeklyPromotionApp;
