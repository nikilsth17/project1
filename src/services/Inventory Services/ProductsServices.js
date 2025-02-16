import _BaseAPIService from '../_BaseAPIService';

const apiService = _BaseAPIService.instance;

const ProductsServices = {
  // Define your API functions here
  getList: async () => {
    const response = await apiService.get('/Products/GetList');
    return response.data;
  },
  create: async (postData) => {
    const response = await apiService.post('/Products/Create', postData);
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get('/Products/GetDetail?id='  + id);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete('/Products/Delete?id=' +id);
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await apiService.patch(`/Products/Update?id=` +id, updatedData);
    return response.data;
  },
};

export default  ProductsServices;
