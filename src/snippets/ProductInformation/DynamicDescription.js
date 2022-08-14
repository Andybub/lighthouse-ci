import './DynamicDescription.scss';

export const init = () => {
  const $root = $('#dynamic-description');
  const $script = $root.find('script');
  const { length } = $script;
  if (!length) return;
  for (let i = 0; i < length / 2; i++) {
    const index = i + 1;
    const txt = $root.find(`script[data-id="textblock${index}"]`).html();
    const img = $root.find(`script[data-id="imagetextblock${index}"]`).html();
    if (txt && img) {
      const $wrap = $('<div></div>').addClass('desc-wrapper');
      $(`<img class="desc-image" src="${img}" />`).appendTo($wrap);
      $('<div class="desc-text"></div>').html(txt).appendTo($wrap);
      $root.append($wrap);
    }
  }
  $script.remove();
};
