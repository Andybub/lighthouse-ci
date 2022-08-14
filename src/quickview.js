import { MainATC } from '@/modules/ProductMainATC';
import { FreePromotions } from '@/snippets/ProductFreePromo';
import { VariantSwatch } from '@/snippets/ProductVariants';
import { DiscountHandler } from '@/modules/ProductDiscount';
import { Wishlist } from '@/modules/ProductWishlist';
import './scss/product.scss';
import './scss/quickview.scss';

$(() => {
  const $root = $('.sc-registered[data-section-type="product"]');
  const sectionId = $root.data('section-id');
  const productData = JSON.parse($(`#ProductJson-${sectionId}`).text());
  const collectionsData = JSON.parse($(`#CollectionsJson-${sectionId}`).text());
  const variantsData = JSON.parse($(`#VariantsJson-${sectionId}`).text());
  const defaultVariant = +$root.find(`#ProductSelect-${sectionId}`).val();

  // eslint-disable-next-line no-underscore-dangle
  // window?._swat?.initializeActionButtons(`#ProductSection-${sectionId}`);

  console.log($root, sectionId, productData, variantsData, defaultVariant);
  MainATC.init($root, sectionId, productData, variantsData, defaultVariant);
  FreePromotions.init();
  VariantSwatch.init();
  DiscountHandler.initDiscountBadge($root, productData);
  DiscountHandler.initDiscountPrice($root, collectionsData);
  Wishlist.initQuickView($root, sectionId);
});
