import { createRoot } from 'react-dom/client';
import CollectionApp from '@/react/pages/collection';
import { quickViewDetailClickTracking } from '@/utils/FastSimonTracking';
import { getParamsFromURL } from '@/react/utils/FastSimon';

const collectionDOM = document.getElementById('react-collection');
export const categoryID = JSON.parse(`"${collectionDOM.getAttribute('data-id')}"`);
const title = JSON.parse(`"${collectionDOM.getAttribute('data-title')}"`);
const relatedSubCategoriesDOM = document.getElementById('related-sub-categories');
const relatedSubCategories = relatedSubCategoriesDOM ? JSON.parse(relatedSubCategoriesDOM.innerHTML) : [];
// console.log('relatedSubCategories', relatedSubCategories);

const metafieldsDOM = document.getElementById('metafields');
const metafields = JSON.parse(metafieldsDOM.innerHTML);
// console.log('metafields', metafields);
// console.log('looks', metafields.global.looks);

const descriptionDOM = document.getElementById('collection-description');
const description = descriptionDOM.innerHTML;
// TODO keep only one <h1> tag
// descriptionDOM.remove();

const dom = document.getElementById('react-collection');
const root = createRoot(dom);
const { page, sortBy, narrowBy } = getParamsFromURL(document.location);
root.render(
  <CollectionApp
    page={page}
    sortBy={sortBy}
    narrowBy={narrowBy}
    categoryID={categoryID}
    title={title}
    relatedSubCategories={relatedSubCategories}
    metafields={metafields}
    description={description}
  />,
);

// export const categoryID = dom.dataset.id;

$(() => {
  $(document).on('click', 'a.btn-more-details', (e) => {
    quickViewDetailClickTracking({ productID: e.target.dataset.productId });
  });
});
