import './scss/why-buy-from-us.scss';

const anchorPositionOffset = () => {
  const { hash } = window.location;
  const target = document.getElementsByName(hash.replace('#', ''))?.[0];
  $(target).parent().addClass('position-relative');

  const header = document.getElementsByTagName('header')[0];
  const headerHeight = header.getBoundingClientRect().height;

  target.style.position = 'absolute';
  target.style.top = `-${headerHeight}px`;
};

$(() => {
  anchorPositionOffset();
})
