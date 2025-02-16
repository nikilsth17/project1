
import _BaseAPIService from '../../_BaseAPIService';

const apiService = _BaseAPIService.instance;

const InstructionServices = {
  // Define your API functions here
  getList: async () => {
    const response = await apiService.get('/instruction');
    return response.data;
  },

  getListDelivery: async () => {
    const response = await apiService.get('/instruction/delivery-instruction');
    return response.data;
  },

  getListPickup: async () => {
    const response = await apiService.get('/instruction/pickup-instruction');
    return response.data;
  },

  create: async (postData) => {
    const response = await apiService.post('/instruction', postData);
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get(`/instruction/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/instruction/${id}`);
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await apiService.put(`/instruction/${id}`, updatedData);
    return response.data;
  },
};

export default InstructionServices



