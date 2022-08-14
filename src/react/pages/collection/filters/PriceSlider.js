import './PriceSlider.scss';
import { useCallback } from 'react';
import Slider from 'rc-slider';
import PropTypes from 'prop-types';

const PriceSlider = (props) => {
  const { min, max, defaultValue } = props;
  // console.log('PriceSlider', min, max, defaultValue);
  let { onAfterChange } = props;
  if (!onAfterChange) {
    onAfterChange = useCallback(
      (newValue) => {
        console.log('default onAfterChange', newValue);
      },
      [min, max, defaultValue],
    );
  }
  const marksValue = [];
  marksValue.push(min);
  if (max - min >= 4) {
    marksValue.push(parseInt(min + (max - min) / 4, 10));
    marksValue.push(parseInt(min + (max - min) / 2, 10));
    marksValue.push(parseInt(min + ((max - min) * 3) / 4, 10));
  } else if (max - min >= 3) {
    marksValue.push(parseInt(min + (max - min) / 3, 10));
    marksValue.push(parseInt(min + ((max - min) * 2) / 3, 10));
  } else if (max - min >= 2) {
    marksValue.push(parseInt(min + (max - min) / 2, 10));
  }
  marksValue.push(max);
  const marks = {};
  marksValue.forEach((item) => {
    marks[item] = item;
  });

  // console.log('defaultValue', defaultValue);

  return (
    <Slider
      range
      allowCross={false}
      min={min}
      max={max}
      defaultValue={defaultValue}
      marks={marks}
      onAfterChange={onAfterChange}
    />
  );
};

PriceSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  defaultValue: PropTypes.array,
  onAfterChange: PropTypes.func,
};

PriceSlider.defaultProps = {
  defaultValue: [0, 100],
  onAfterChange: null,
};

export default PriceSlider;
