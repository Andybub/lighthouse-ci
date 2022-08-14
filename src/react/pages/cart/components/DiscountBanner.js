import './DiscountBanner.scss';
import { memo, useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { countdownTimeOnly } from '@/utils/Countdown';
import { applyCode } from '@/utils/discount-code/apply-code';

const DiscountBanner = () => {
  const {
    endHeader,
    discountType,
    discountCode,
    specificCollection1,
    specificCollection2,
    specificCollection3,
    specificCollection4,
    specificCollection5,
    cartPageApplySuccessMessage,
    cartPageButtonText,
    cartPageMessage,
  } = window.TW.DiscountBanner;

  const cart = useSelector((state) => state.cart);
  let weeklyMatch = false;
  if (discountType === 'weekly' && cart && cart.items && cart.items.length > 0) {
    weeklyMatch = cart.items.find((item) => {
      return (
        item.collections &&
        (item.collections.includes(specificCollection1) ||
          item.collections.includes(specificCollection2) ||
          item.collections.includes(specificCollection3) ||
          item.collections.includes(specificCollection4) ||
          item.collections.includes(specificCollection5))
      );
    });
  }

  const discountUrl = `/discount/${discountCode}?redirect=/cart`;

  const [isApplied, setIsApplied] = useState(false);
  const [countdown, setCountdown] = useState('');

  // TODO test countdown 5 seconds
  useEffect(() => {
    let timerId;
    if (endHeader) {
      let time = countdownTimeOnly(endHeader, 3);
      if (time) {
        setCountdown(time, 3);
        timerId = setInterval(() => {
          time = countdownTimeOnly(endHeader, 3);
          setCountdown(time);
          if (!time) {
            clearInterval(timerId);
          }
        }, 1000);
      }
    }
  }, []);

  const applyHandle = useCallback(
    (e) => {
      if (discountCode) {
        e.preventDefault();
        e.stopPropagation();
        applyCode(discountCode);
        setIsApplied(true);
      }
    },
    [discountCode, setIsApplied],
  );

  if (
    (discountType === 'sitewide' || weeklyMatch) &&
    discountCode &&
    cartPageApplySuccessMessage &&
    cartPageButtonText &&
    cartPageMessage
  ) {
    return (
      <div className="discount-banner-container">
        {isApplied ? (
          <div className="discount-banner-success" dangerouslySetInnerHTML={{ __html: cartPageApplySuccessMessage }} />
        ) : (
          <div className="discount-banner-wrapper">
            <div className="discount-banner-content px-3">
              <div className="discount-banner-text">{cartPageMessage}</div>
              {countdown && (
                <div className="discount-banner-countdown">
                  <span className="ends-in">Ends in</span>
                  <span className="count-down"> {countdown}</span>
                </div>
              )}
              <a onClick={applyHandle} className="discount-banner-button" href={discountUrl}>
                <span className="button-text">{cartPageButtonText}</span>
                <span className="finger">
                  <img src={`${window.TW.assetPath}finger.svg`} alt="finger" />
                </span>
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <div />;
};

export default memo(DiscountBanner);
