import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const InsuranceServices = {
  getList: async () => {
    try {
      const response = await apiService.get('/insurance');
      return response.data;
    } catch (error) {
      console.error('Error fetching insurance list:', error);
      throw error;
    }
  },
  create: async (postData) => {
    try {
      const response = await apiService.post('/insurance', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating insurance:', error);
      throw error;
    }
  },
  view: async (id) => {
    try {
      const response = await apiService.get(`/insurance/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching insurance details:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await apiService.delete(`/insurance/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting insurance:', error);
      throw error;
    }
  },
  update: async (id, updatedData) => {
    try {
      const response = await apiService.put(`/insurance/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating insurance:', error);
      throw error;
    }
  },
};

export default InsuranceServices;
