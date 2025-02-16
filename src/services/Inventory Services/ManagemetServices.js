import _BaseAPIService from '../_BaseAPIService';

const apiService = _BaseAPIService.instance;

const  ManagemetServices = {
  // Define your API functions here
  getList: async () => {
    const response = await apiService.get('/UserManagement/GetList');
    return response.data;
  },
  create: async (postData) => {
    const response = await apiService.post('/UserManagement/Create', postData);
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get(`/UserManagement/Detail/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/UserManagement/Delete/${id}`);
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await apiService.put(`/UserManagement/Update/${id}` , updatedData);
    return response.data;
  },
  MenuInfogetList: async () => {
    const response = await apiService.get('/MenuInfo');
    return response.data;
  },

  
};

export default  ManagemetServices;
