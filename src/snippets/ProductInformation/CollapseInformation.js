import './CollapseInformation.scss';

export const init = () => {
  const $root = $('#collapse-information');
  const $content = $root.find('.collapse-content');
  const $toggle = $root.find('.btn-collapse>.btn');
  $toggle.on('click', () => {
    const isShow = $root.toggleClass('show').hasClass('show');
    $toggle.find('span').text(`Show ${isShow ? 'Less' : 'More'}`);
    if (isShow) $root.css('max-height', `${$content.height()}px`);
    else $root.css('max-height', '380px');
  });
};
