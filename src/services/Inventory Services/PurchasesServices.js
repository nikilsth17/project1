import _BaseAPIService from '../_BaseAPIService';

const apiService = _BaseAPIService.instance;


const PurchasesServices = {
  // Define your API functions here
  getList: async () => {
    const response = await apiService.get('/Purchase/GetList');
    return response.data;
  },
  create: async (postData) => {
    const response = await apiService.post('/Purchase/Create', postData);
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get('/Purchase/GetDetail?id='  + id);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete('/Purchase/Delete?id=' +id);
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await apiService.patch(`/Purchase/Update?id=` +id, updatedData);
    return response.data;
  },
};

export default PurchasesServices;
