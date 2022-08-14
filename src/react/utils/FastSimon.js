const ruleHeight = {
  inch: [
    { name: `Under 5"`, func: (dis) => dis <= 5 },
    { name: `6" - 10"`, func: (dis) => dis >= 6 && dis <= 10 },
    { name: `11" - 15"`, func: (dis) => dis >= 11 && dis <= 15 },
    { name: `16" - 20"`, func: (dis) => dis >= 16 && dis <= 20 },
    { name: `21" - 25"`, func: (dis) => dis >= 21 && dis <= 25 },
    { name: `26" - 30"`, func: (dis) => dis >= 26 && dis <= 30 },
    { name: `31" - 35"`, func: (dis) => dis >= 31 && dis <= 35 },
    { name: `36" - 40"`, func: (dis) => dis >= 36 && dis <= 40 },
    { name: `41" - 50"`, func: (dis) => dis >= 41 && dis <= 50 },
    { name: `Over 50"`, func: (dis) => dis >= 50 },
  ],
  feet: [
    { name: `Under 10FT`, func: (dis) => dis <= 10 },
    { name: `Over 10FT`, func: (dis) => dis >= 10 },
  ],
};

const ruleLength = {
  inch: [
    { name: `Under 5"`, func: (dis) => dis <= 5 },
    { name: `6" - 10"`, func: (dis) => dis >= 6 && dis <= 10 },
    { name: `11" - 15"`, func: (dis) => dis >= 11 && dis <= 15 },
    { name: `16" - 20"`, func: (dis) => dis >= 16 && dis <= 20 },
    { name: `21" - 50"`, func: (dis) => dis >= 21 && dis <= 50 },
    { name: `51" - 70"`, func: (dis) => dis >= 51 && dis <= 70 },
    { name: `71" - 90"`, func: (dis) => dis >= 71 && dis <= 90 },
    { name: `91" - 100"`, func: (dis) => dis >= 91 && dis <= 100 },
    { name: `100" - 102"`, func: (dis) => dis >= 101 && dis <= 102 },
    { name: `102"`, func: (dis) => dis === 102 },
    { name: `108"`, func: (dis) => dis === 108 },
    { name: `120"`, func: (dis) => dis === 120 },
    { name: `126"`, func: (dis) => dis === 126 },
    { name: `132"`, func: (dis) => dis === 132 },
    { name: `156"`, func: (dis) => dis === 156 },
  ],
  feet: [
    { name: `Under 10FT`, func: (dis) => dis <= 10 },
    { name: `11 - 20FT`, func: (dis) => dis >= 11 && dis <= 20 },
    { name: `21 - 50FT`, func: (dis) => dis >= 21 && dis <= 50 },
    { name: `Over 50FT`, func: (dis) => dis >= 50 },
  ],
  yard: [
    { name: `Under 5 Yards`, func: (dis) => dis <= 5 },
    { name: `10 Yards`, func: (dis) => dis === 10 },
    { name: `15 - 30 Yards`, func: (dis) => dis >= 15 && dis <= 30 },
    { name: `Over 30 Yards`, func: (dis) => dis >= 30 },
  ],
};

const ruleWidth = {
  inch: [
    { name: `Under 5"`, func: (dis) => dis <= 5 },
    { name: `6" - 10"`, func: (dis) => dis >= 6 && dis <= 10 },
    { name: `11" - 15"`, func: (dis) => dis >= 11 && dis <= 15 },
    { name: `16" - 20"`, func: (dis) => dis >= 16 && dis <= 20 },
    { name: `21" - 50"`, func: (dis) => dis >= 21 && dis <= 50 },
    { name: `51" - 54"`, func: (dis) => dis >= 51 && dis <= 54 },
    { name: `54"`, func: (dis) => dis === 54 },
    { name: `60"`, func: (dis) => dis === 60 },
    { name: `70"`, func: (dis) => dis === 70 },
    { name: `72"`, func: (dis) => dis === 72 },
    { name: `85"`, func: (dis) => dis === 85 },
    { name: `90"`, func: (dis) => dis === 90 },
    { name: `108"`, func: (dis) => dis === 108 },
    { name: `120"`, func: (dis) => dis === 120 },
    { name: `132"`, func: (dis) => dis === 132 },
  ],
  feet: [
    { name: `Under 5FT`, func: (dis) => dis <= 5 },
    { name: `6 - 10FT`, func: (dis) => dis >= 6 && dis <= 10 },
    { name: `Over 10FT`, func: (dis) => dis >= 10 },
  ],
};

const getGroup = (type, distanceStr) => {
  const distance = distanceStr.replace(`size:${type}-`, '').replaceAll(' ', '').toLowerCase();
  let rule;
  if (type === 'length') {
    rule = ruleLength;
  } else if (type === 'width') {
    rule = ruleWidth;
  } else if (type === 'height') {
    rule = ruleHeight;
  }
  if (distance.includes('yards')) {
    return rule.yard.filter((r) => r.func(parseFloat(distance.replace('yards', ''))));
  }
  if (distance.includes('ft')) {
    return rule.feet.filter((r) => r.func(parseFloat(distance.replace('ft', ''))));
  }
  // distance.includes('"')
  return rule.inch.filter((r) => r.func(parseFloat(distance.replace('"', ''))));
};

const createGroup = (type, array) => {
  // console.log("createGroup");
  const result = [];
  for (let i = 0; i < array.length; i += 1) {
    const item = array[i];
    const groupNames = getGroup(type, item[0]);
    if (groupNames) {
      // console.log(i, item[0], groupNames);
      groupNames.forEach((obj) => {
        // console.log("obj", obj);
        const existGroup = result.find((group) => group[0] === obj.name);
        // console.log("existGroup", existGroup);
        if (existGroup) {
          existGroup[1] += item[1];
          existGroup[2].push(item);
        } else {
          result.push([obj.name, item[1], [item]]);
        }
      });
    }
  }
  // console.log("before", result);
  // sort result
  let rule;
  if (type === 'length') {
    rule = ruleLength;
  } else if (type === 'width') {
    rule = ruleWidth;
  } else if (type === 'height') {
    rule = ruleHeight;
  }
  const initInchIndex = 0;
  const initFeetIndex = rule.inch.length;
  const initYardIndex = initFeetIndex + rule.feet.length;
  result.sort((a, b) => {
    // console.log(" ");
    const aName = a[0];
    const bName = b[0];
    // console.log(aName);
    // console.log(bName);
    let aIndex = -1;
    let bIndex = -1;
    for (const i in rule) {
      // console.log(i);
      let initIndex = 0;
      if (i === 'inch') {
        initIndex = initInchIndex;
      } else if (i === 'feet') {
        initIndex = initFeetIndex;
      } else if (i === 'yard') {
        initIndex = initYardIndex;
      }
      const ruleSub = rule[i];
      const aSubIndex = ruleSub.findIndex((item) => item.name === aName);
      if (aSubIndex > -1) {
        aIndex = initIndex + aSubIndex;
      }
      const bSubIndex = ruleSub.findIndex((item) => item.name === bName);
      if (bSubIndex > -1) {
        bIndex = initIndex + bSubIndex;
      }
    }
    // console.log(aIndex, bIndex);
    if (aIndex > bIndex) return 1;
    if (aIndex < bIndex) return -1;
    return 0;
  });
  // console.log("after", result);
  return result;
};

export const createSizeGroup = (name, content) => {
  // console.log("createSizeGroup");
  if (name.includes('general')) {
    return content;
  }
  if (name.includes('length')) {
    return createGroup('length', content);
  }
  if (name.includes('width')) {
    return createGroup('width', content);
  }
  if (name.includes('height')) {
    return createGroup('height', content);
  }
  if (name.includes('volume')) {
    return content;
  }
  return content;
};

export const getSizeGroupNarrow = ({ sizeGroup, group, value }) => {
  // console.log("getSizeGroupNarrow", group, value);
  const groupLowerCase = group.toLowerCase();
  if (groupLowerCase.includes('length')) {
    return sizeGroup.length.find((item) => item[0] === value)[2];
  }
  if (groupLowerCase.includes('width')) {
    return sizeGroup.width.find((item) => item[0] === value)[2];
  }
  if (groupLowerCase.includes('height')) {
    return sizeGroup.height.find((item) => item[0] === value)[2];
  }
  return undefined;
};

export const sortByMapping = [
  { key: 'relevancy', value: 'Best Match' },
  { key: 'price_min_to_max', value: 'Price: Low to High' },
  { key: 'price_max_to_min', value: 'Price: High to Low' },
  { key: 'creation_date', value: 'Newest Arrivals' },
  { key: 'reviews', value: 'Customer Rating' },
];

const removeDuplicatedNarrows = (array) => {
  // TODO [["Shape","shape-rectangle"],["Shape","shape-round"],["Shape","shape-square"],["Shape","shape-square"]]
  return array;
};

export const getParamsFromURL = (url) => {
  const params = new URL(url).searchParams;
  let page = parseInt(params.get('page_num'), 10);
  if (Number.isNaN(page) || page < 1) {
    page = 1;
  }
  let sortBy = params.get('sort_by');
  if (!sortByMapping.find((s) => s.key === sortBy)) {
    sortBy = sortByMapping[0].key;
  }
  let narrowBy = params.get('narrow');
  try {
    narrowBy = JSON.parse(narrowBy);
    if (!narrowBy) {
      narrowBy = [];
    }
  } catch (error) {
    narrowBy = [];
  }
  narrowBy = removeDuplicatedNarrows(narrowBy);
  const query = params.get('q');
  return { page, sortBy, narrowBy, query };
};

/**
 * Patch Data.
 * @param {array} dataFS - Data from Fast Simon SDK.
 * @param {array} dataShopify - Data from Shopify Search.
 */
export const patchProductsData = (dataFS, dataShopify) => {
  return dataFS.map((product) => {
    const match = dataShopify.find((item) => {
      return String(item.id) === String(product.id);
    });
    if (match) {
      return {
        ...product,
        personalized: match.personalized,
        size: match.size,
        inventory_quantity: match.inventory_quantity,
        inventory_policy: match.inventory_policy,
        sold_out: match.sold_out,
        variants: match.variants,
        images: match.images,
      };
    }
    return product;
  });
};

export const regulateFilterName = (str, avoidPrefixList) => {
  if (!str) return '';
  if (avoidPrefixList && avoidPrefixList.length > 0) {
    avoidPrefixList.forEach((prefix) => {
      str = str.replace(prefix, '');
    });
    return str;
  }
  return str
    .replace('categ-', '')
    .replace('Categ-', '')
    .replaceAll('USD:', '')
    .replace('size:length-', '')
    .replace('size:width-', '')
    .replace('size:height-', '')
    .replace('material-', '')
    .replace('style-', '')
    .replace('shape-', '')
    .replace('type-', '');
};

export const isColorFacet = (facetName) => {
  return String(facetName).toLowerCase() === 'color';
};

export const isPriceFacet = (facetName) => {
  return String(facetName).toLowerCase() === 'price';
};

export const isPriceMinFacet = (facetName) => {
  return String(facetName).toLowerCase() === 'price_min';
};

export const isPriceMaxFacet = (facetName) => {
  return String(facetName).toLowerCase() === 'price_max';
};

export const isRatingFacet = (facetName) => {
  return String(facetName).toLowerCase() === 'customer rating';
};

export const isSizeFacet = (facetName) => {
  const fn = String(facetName).toLowerCase();
  return fn === 'size length' || fn === 'size width' || fn === 'size height';
};

export const isSizeLinen = (facetName) => {
  return String(facetName).toLowerCase() === 'size linen';
};

export const isInStockFacet = (facetName) => {
  return String(facetName).toLowerCase() === 'in stock';
};

export const isReviewsFacet = (facetName) => {
  return String(facetName).toLowerCase() === 'customer rating';
};

export const isPriceFromToNarrow = (narrowName) => {
  return String(narrowName).toLowerCase() === 'price_from_to';
};

const isTitleContainPromoTile = (title) => {
  return title.toLowerCase().includes('promo tile');
};

const isTagsContainPromoTile = (tags) => {
  return tags.filter((tag) => tag.toLowerCase() === 'isp_promo_ads').length > 0;
};

export const isPromoTile = (title, tags) => {
  return isTitleContainPromoTile(title) || isTagsContainPromoTile(tags);
};

const htmlDecode = (input) => {
  const e = document.createElement('textarea');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
};

export const stlId = (description) => {
  return new window.URL(htmlDecode(description)).searchParams.get('look');
};

export const stlHref = (description) => {
  return htmlDecode(description);
};

const getTagsFromAttributes = (attributes) => {
  const result = attributes.find((att) => String(att[0]).toLowerCase() === 'tag');
  return result ? result[1] : [];
};

const getTypeFromAttributes = (attributes) => {
  const result = attributes.find((att) => String(att[0]).toLowerCase() === 'type');
  return result ? result[1][0] : '';
};

export const productVariablesFormalization = (product) => ({
  // Fast Simon SDK
  id: product.id,
  url: product.u || product.url,
  title: product.l || product.title,
  image: product.t ? product.t.replace('_large', '') : product.image ? product.image : '',
  variantID: product.s
    ? product.s.replace(product.id, '').replace('::', '')
    : product.variantID
    ? product.variantID
    : '',
  price: product.p || product.price,
  comparePrice: product.p_min_c || product.compare_price,
  tags: product.att ? getTagsFromAttributes(product.att) : product.tags ? product.tags : [],
  type: product.att ? getTypeFromAttributes(product.att) : product.type ? product.type : '',
  review: product.review,
  reviewsAverage: product.reviews_average ? product.reviews_average : 0,
  reviewsCount: product.reviews_count,
  // isSoldOut: product.iso,
  description: product.d || product.description,

  // Shopify Search
  personalized: Boolean(product.personalized),
  size: product.size ? product.size : null,
  inventoryQuantity: product.inventory_quantity ? product.inventory_quantity : null,
  inventoryPolicy: product.inventory_policy ? product.inventory_policy : null,
  soldOut: product.sold_out ? product.sold_out : null,
  variants: product.variants ? product.variants : null,
  images: product.images ? product.images : null,
});

export const collectionVariablesFormalization = (collection) => ({
  // Fast Simon SDK
  id: collection.id,
  title: collection.l,
  description: collection.d,
  url: collection.u,
  image: collection.t, // https://assets.instantsearchplus.com/ TODO collection image missing issue
});
