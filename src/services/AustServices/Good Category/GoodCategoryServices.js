import _BaseAPIService from '../../_BaseAPIService';

const apiService = _BaseAPIService.instance;

const GoodCategoryServices = {
    // Define your API functions here
    getList: async () => {
      const response = await apiService.get('/good-category');
      return response.data;
    },
    create: async (postData) => {
      const response = await apiService.post('/good-category', postData);
      return response.data;
    },
    view: async (id) => {
      const response = await apiService.get(`/good-category/${id}`);
      return response.data;
    },
    delete: async (id) => {
      const response = await apiService.delete(`/good-category/${id}`);
      return response.data;
    },
    update: async (id, updatedData) => {
      const response = await apiService.put(`/good-category/${id}`, updatedData);
      return response.data;
    },
  };

export default GoodCategoryServices
