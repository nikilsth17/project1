import _BaseAPIService from '../_BaseAPIService';

const apiService = _BaseAPIService.instance;

const SystemServices = {
  
      // Define your API functions here
  getList: async () => {
    const response = await apiService.get('/UserRoles/GetList');
    return response.data;
  },
  create: async (postData) => {
    const response = await apiService.post('/UserRoles/Create', postData);
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get(`/UserRoles/Detail/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/UserRoles/Delete/${id}`  );
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await apiService.put(`/UserRoles/Edit/${id}` ,updatedData);
    return response.data;
},
};

  
export default SystemServices