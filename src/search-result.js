import { createRoot } from 'react-dom/client';
import SearchResultApp from '@/react/pages/search-result';
import { quickViewDetailClickTracking } from '@/utils/FastSimonTracking';
import { getParamsFromURL } from '@/react/utils/FastSimon';

const dom = document.getElementById('react-search-result');
const root = createRoot(dom);
const { page, sortBy, narrowBy, query } = getParamsFromURL(document.location);
root.render(<SearchResultApp page={page} sortBy={sortBy} narrowBy={narrowBy} query={query} />);

$(() => {
  $(document).on('click', 'a.btn-more-details', (e) => {
    quickViewDetailClickTracking({ productID: e.target.dataset.productId });
  });
});
