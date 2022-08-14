import SlideItem from './SlideItem';

export default {
  title: 'pdp/SlideItem',
  component: SlideItem,
};

const productBase = {
  href: '/products/rose-gold-sparkle-glitter-wedding-aisle-runner-non-woven-red-carpet-runner-prom-hollywood-glam-parties-blush-3ft-x-50ft',
  id: 6570751787054,
  imageUrl: 'https://cdn.shopify.com/s/files/1/1552/7691/products/RUNER_GLIT01_50_054_D09_large.jpg?v=1623255726',
  imageUrl2: 'https://assets.instantsearchplus.com/thumbs/cdn.shopify.com/8421a079-aed1-4bb6-b1d9-bee1e8ba624e',
  personalized: false,
  price: '$49.99',
  regularPrice: '$87.49',
  title:
    'Rose Gold Sparkle Glitter Wedding Aisle Runner, Non-Woven Red Carpet Runner Prom, Hollywood, Glam Parties - Blush | 3FT x 50FT',
};

const variantId = 39358875861038;

export const CABItem = () => {
  const product = {
    ...productBase,
    variantId,
  };
  return (
    <div style={{ width: '180px' }}>
      <SlideItem product={product} />
    </div>
  );
};

export const RVItem = () => {
  const product = {
    ...productBase,
  };
  return (
    <div style={{ width: '180px' }}>
      <SlideItem product={product} />
    </div>
  );
};

export const ATCPOPItem = () => {
  const product = {
    ...productBase,
    variantId,
  };
  return (
    <div style={{ width: '180px' }}>
      <SlideItem product={product} hoverDisabled />
    </div>
  );
};
