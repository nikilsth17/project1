import _BaseAPIService from '../_BaseAPIService';

const apiService = _BaseAPIService.instance;

const ProductCategoriesServices = {
  // Define your API functions here
  getList: async () => {
    const response = await apiService.get('/ProductCategories/GetList');
    return response.data;
  },
  create: async (postData) => {
    const response = await apiService.post('/ProductCategories/Create', postData);
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get('/ProductCategories/GetDetail?id='  + id);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete('/ProductCategories/Delete?id='  + id);
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await apiService.patch(`/ProductCategories/Update?id=` +id, updatedData);
    return response.data;
  },
};

export default ProductCategoriesServices;
