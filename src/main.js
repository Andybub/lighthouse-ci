import 'current-script-polyfill';
import './scss/main.scss';
import CartEvent from '@/events/CartEvent';
import KlaviyoBIS from '@/events/KlaviyoBIS';
import initHeader from '@/sections/Header';
import { initFooter } from '@/sections/Footer';
import { initSizeChartModal } from '@/snippets/SizeChartModal';
import { initComm100API } from '@/modules/Comm100';
import { initBreadcrumbs } from './snippets/Breadcrumbs';

export * as EventEmitter from '@/events/EventEmitter';
export const { CART_LOADED, CART_ADDED, CART_UPDATED, POPUP_ADDED_CART, CLOSE_ADDED_CART } = CartEvent;
export const { POPUP_KLAVIYO_BIS, CLOSE_KLAVIYO_BIS } = KlaviyoBIS;

$(() => {
  CartEvent.init();
  KlaviyoBIS.init();
  initHeader();
  initFooter();
  initSizeChartModal();
  initComm100API({ onlyDesktop: true });
  initBreadcrumbs();
});
