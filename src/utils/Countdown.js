/**
 * calculate seconds of duration from now to target time
 * @param {number} targetSeconds - target time by seconds
 * @returns {number} duration by seconds
 */
const secondsFromNow = (targetSeconds) => {
  const intTargetSeconds = parseInt(targetSeconds, 10);
  const intNowSeconds = parseInt(Date.now() / 1000, 10);
  return intTargetSeconds - intNowSeconds;
};

/**
 * transform seconds to time format HH:MM:SS
 * @param {number} sourceSeconds - duration by seconds
 * @returns {string} time format HH:MM:SS
 */
const secondsToHHMMSS = (sourceSeconds) => {
  const intSeconds = parseInt(sourceSeconds, 10);
  if (intSeconds < 0) return '00:00:00';
  const numHours = Math.floor(intSeconds / 3600);
  const numMinutes = Math.floor((intSeconds % 3600) / 60);
  const numSeconds = intSeconds % 60;
  const strHours = String(numHours).padStart(2, '0');
  const strMinutes = String(numMinutes).padStart(2, '0');
  const strSeconds = String(numSeconds).padStart(2, '0');
  return `${strHours}:${strMinutes}:${strSeconds}`;
};

/**
 * transform seconds to time format N Days
 * @param {number} sourceSeconds - duration by seconds
 * @returns {string} time format N Days
 */
const secondsToDays = (sourceSeconds) => {
  const intSeconds = parseInt(sourceSeconds, 10);
  const numDays = Math.ceil(intSeconds / 86400);
  return `${numDays} Day${numDays > 1 ? 's' : ''}`;
};

/**
 * show countdown with HH:MM:SS or hidden
 * @param {number} target - target time by seconds
 * @param {number} maxDays - hidden when more than this
 * @returns {string} countdown format HH:MM:SS or empty
 */
export const countdownTimeOnly = (target, maxDays = 3) => {
  const seconds = secondsFromNow(target);
  const numDays = Math.floor(seconds / 86400);
  if (numDays > maxDays) return '';
  return secondsToHHMMSS(seconds);
};

/**
 * show countdown with N Days or HH:MM:SS
 * @param {number} target - target time by seconds
 * @param {number} minDays - less then HH:MM:SS / more then N Days
 * @returns {string} countdown format N Days or HH:MM:SS
 */
export const countdownDayOrTime = (target, minDays = 1) => {
  const seconds = secondsFromNow(target);
  const numDays = Math.floor(seconds / 86400);
  if (numDays < minDays) return secondsToHHMMSS(seconds);
  return secondsToDays(seconds);
};
