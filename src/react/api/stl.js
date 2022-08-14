import { createAxiosInstance } from '@/react/api/axiosInstance';

const baseURL = 'https://stl-api.efmt.app/f/api';
// process.env.NODE_ENV === 'production' ? 'https://stl-api.efmt.app/f/api' : 'https://stl-api-uat.efmt.app/f/api';

const apiInstance = createAxiosInstance({ baseURL });

const shopifyInstance = createAxiosInstance();

export const getTags = () => apiInstance.get('/tags');

export const getLookDetail = (id) => apiInstance.get(`/looks/${id}`);

export const getLooksByQuery = (params) => apiInstance.get(`/looks?${params}`);

export const getLooksByProduct = (id) => apiInstance.get(`/products/${id}/looks`);

export const getLooksByMetafield = (ids) => apiInstance.get(`/looks/ids/${ids}`);

export const getLooksByMetafieldSkus = (skus) => apiInstance.get(`/looks/skus/${skus}`);

export const getProductsByQuery = (query) =>
  shopifyInstance.get(`/search?q=${query}&type=product&view=tw-shop-the-look`);

export const getVariantsByCollection = (collection) =>
  shopifyInstance.get(`/collections/${collection}?view=tw-shop-the-look&page=1`);

export const getVariantsByProduct = (handle) =>
  Promise.all([
    shopifyInstance.get(`/products/${handle}.js`),
    shopifyInstance.get(`/products/${handle}?view=inventory`),
  ]).then((list) => list.reduce((result, data) => ({ ...result, ...data }), {}));

export const addToCart = (items) => shopifyInstance.post('/cart/add.js', { items });

export const getCart = () => shopifyInstance.get('/cart.js');
