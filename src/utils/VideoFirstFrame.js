// https://github.com/jcindex/video-first-frame/blob/main/src/index.js
const defer = () => {
  const obj = {};
  obj.promise = new Promise((resolve, reject) => {
    obj.resolve = resolve;
    obj.reject = reject;
  });
  return obj;
};

function video2canvas(video, returnBlob, quality, done) {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  try {
    ctx.drawImage(video, 0, 0);
  } catch (e) {
    done(null);
    return;
  }
  if (!returnBlob) {
    done(canvas.toDataURL('image/png', 1));
    return;
  }
  canvas.toBlob(
    (blob) => {
      const rname = Math.random().toString(16).slice(2);
      const file = new window.File([blob], `start-${rname}.png`, {
        type: 'image/png',
      });
      done(file);
      URL.revokeObjectURL(blob); // revoke Blob
    },
    'image/png',
    quality,
  );
}

export const VideoFirstFrame = {
  /**
   * capture first frame of video
   * @param {File} file
   * @param {boolean} returnBlob
   * @param {number} quality
   */
  get(file, returnBlob = true, quality = 1) {
    const videoEl = document.createElement('video');
    videoEl.src = URL.createObjectURL(file);
    videoEl.volume = 0;
    videoEl.playsInline = true;
    // videoEl.setAttribute('x5-video-player-type', 'h5');
    videoEl.setAttribute('playsinline', 'true');
    videoEl.setAttribute('webkit-playsinline', 'true');
    videoEl.onplay = () => {
      if (typeof videoEl.webkitExitFullscreen === 'function') {
        videoEl.webkitExitFullscreen();
      }
      if (typeof videoEl.mozExitFullscreen === 'function') {
        videoEl.mozExitFullscreen();
      }
      if (typeof videoEl.exitFullscreen === 'function') {
        videoEl.exitFullscreen();
      }
    };
    videoEl.style.cssText = `position:absolute;left:-999999px;top:-999999px;`;
    document.body.appendChild(videoEl);
    videoEl.play();
    const defered = defer();
    /* eslint no-param-reassign: ["error", { "props": false }] */
    videoEl.oncanplay = (e) => {
      setTimeout(() => {
        // delay 100ms to make sure video is not blank in iOS
        video2canvas(e.target, returnBlob, quality, defered.resolve);
      }, 100);
    };
    videoEl.onerror = (e) => {
      defered.reject(e);
    };
    return defered.promise.then((response) => {
      document.body.removeChild(videoEl);
      return response;
    });
  },
};
