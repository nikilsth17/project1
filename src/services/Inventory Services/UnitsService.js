import _BaseAPIService from '../_BaseAPIService';

const apiService = _BaseAPIService.instance;

const UnitsService = {
  // Define your API functions here
  getList: async () => {
    const response = await apiService.get('/Units/GetList');
    return response.data;
  },
  create: async (postData) => {
    const response = await apiService.post('/Units/Create', postData);
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get('/Units/GetDetail?id='  + id);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete('/Units/Delete?id=' +id);
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await apiService.patch(`/Units/Update?id=` +id, updatedData);
    return response.data;
  },
};

export default UnitsService;
