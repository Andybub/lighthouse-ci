import './index.scss';
import { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { getSiteWideReviewSummary } from '@/service/ReviewsAPI';

const dom = document.getElementById('tw-react-sitewide-review-carousel');
const fixSafari = () => {
  $('.review-title').css('-webkit-line-clamp', '2');
  $('.review-message').css('-webkit-line-clamp', '2');
  setTimeout(() => {
    $('.review-title').css('-webkit-line-clamp', '1');
    $('.review-message').css('-webkit-line-clamp', '3');
  }, 50);
};

$(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      // isIntersecting is true when element and viewport are overlapping
      // isIntersecting is false when element and viewport don't overlap
      if (entries[0].isIntersecting === true) {
        // console.log('Element has just become visible in screen');
        observer.unobserve(entries[0].target);
        getSiteWideReviewSummary()
          .then((data) => {
            const totalReviews = data[0].totalAllWithNPS;
            const items = data[0].data;
            $('.btn-stamped-reviews-widget .total-reviews').text(totalReviews.toLocaleString('en-US'));

            const SitewideReviewCarousel = lazy(() =>
              import(
                /* webpackChunkName: 'homepage-review' */
                /* webpackMode: 'lazy' */
                '@/react/ui/sitewideReviewCarousel/SitewideReviewCarousel'
              ),
            );
            const root = createRoot(dom);
            root.render(<SitewideReviewCarousel items={items} totalReviews={totalReviews} />);
            setTimeout(() => {
              fixSafari();
              $('.tw-reviews-container')
                .find('.app-placeholder')
                .removeClass('app-placeholder')
                .find('.invisible')
                .removeClass('invisible');
            }, 2000);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    { rootMargin: '0px' },
  );

  observer.observe(document.querySelector('#tw-react-sitewide-review-carousel'));
});
