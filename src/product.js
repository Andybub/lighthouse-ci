import './scss/product.scss';
import { Customizer, /* ReviewsGalleryModal, */ initSTL, initCAB, initRV } from '@/snippets/ProductLayout';
import { MainATC } from '@/modules/ProductMainATC';
import { FreePromotions } from '@/snippets/ProductFreePromo';
import { VariantSwatch } from '@/snippets/ProductVariants';
import { CollapseInformation, DynamicDescription } from '@/snippets/ProductInformation';
import { DiscountHandler } from '@/modules/ProductDiscount';
import { StickyATC } from '@/snippets/ProductStickyATC';
import { Wishlist } from '@/modules/ProductWishlist';
import { directProductTracking } from '@/utils/FastSimonTracking';
import { initReviews } from '@/snippets/ProductReviews';

let productId = null;

$(() => {
  const $root = $('.sc-registered[data-section-type="product"]');
  const sectionId = $root.data('section-id');
  const productData = JSON.parse($(`#ProductJson-${sectionId}`).text());
  const collectionsData = JSON.parse($(`#CollectionsJson-${sectionId}`).text());
  const variantsData = JSON.parse($(`#VariantsJson-${sectionId}`).text());
  const defaultVariant = +$root.find(`#ProductSelect-${sectionId}`).val();

  if (productData.type === 'Personalized') Customizer.init(variantsData);
  MainATC.init($root, sectionId, productData, variantsData, defaultVariant);
  FreePromotions.init();
  VariantSwatch.init();
  DynamicDescription.init();
  CollapseInformation.init();
  // ReviewsGalleryModal.init();
  DiscountHandler.initDiscountBadge($root, productData);
  DiscountHandler.initDiscountBanner($root, collectionsData);
  DiscountHandler.initDiscountPrice($root, collectionsData);
  StickyATC.init($root, productData, variantsData, defaultVariant);
  Wishlist.initProduct($root);
  initSTL();
  initCAB();
  initRV();
  directProductTracking({ productID: productData.id });

  productId = productData.id;
  initReviews();
});

window.onload = () => {
  let intervalID = null;

  intervalID = setInterval(() => {
    const btns = document.querySelectorAll('.swym-button-bar');
    console.log('wishlist btn', btns);

    if ([...btns].every((btn) => [...btn.classList].includes('gtm-atw'))) {
      clearInterval(intervalID);
      intervalID = null;
    } else {
      [...btns].forEach((btn) => {
        btn.classList.add('gtm-atw');
        btn.setAttribute('data-product-id', productId);
      });
    }
  }, 1000);
};
