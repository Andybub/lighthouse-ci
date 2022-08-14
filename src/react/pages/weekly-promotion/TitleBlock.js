import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { countdownDayOrTime } from "@/utils/Countdown";

const TitleBlock = ({ title, time }) => {
  const { contentEnd } = time;
  const [countdownTime, setCountdownTime] = useState('')
  const {
    promo_title: promoTitle,
    show_timer: showTimer,
    timer_label: timerLabel
  } = title

  useEffect(()=>{
    let timer = countdownDayOrTime(contentEnd);

    if (timer !== '') {
      const countDown = () => {
        timer = countdownDayOrTime(contentEnd);
        if (timer.includes(':')) {
          const [h, m, s] = timer.split(':');
          setCountdownTime(`${h}h : ${m}m : ${s}s`)
        } else {
          setCountdownTime(timer)
        }
      }

      countDown();
      setInterval(() => {
        countDown();
      }, 1000);
    }
  },[countdownTime])

  return (
    <div className="container title-block w-100">
      {promoTitle}
      {showTimer && (
        <div className="timer-block">
          {timerLabel} {countdownTime}
        </div>)}
      <div className="hr-line" />
    </div>
  )
};

TitleBlock.propTypes = {
  title: PropTypes.object.isRequired,
  time: PropTypes.object.isRequired,
};

export default TitleBlock;
