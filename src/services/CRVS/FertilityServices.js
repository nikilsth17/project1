import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const FertilityServices = {
  getList: async () => {
    const response = await apiService.get("/fertilities");
    return response.data;
  },
  getCustomerDetail: async (id) => {
    const response = await apiService.get(`/customers/${id}`);
    return response.data;
  },

  getListByDriver: async (driverId) => {
    const response = await apiService.get(`/drivers/${driverId}/customers`);
    return response.data;
  },

  create: async (postData) => {
    const response = await apiService.post("/fertilities", postData);
    return response.data;
  },
  confirm: async (data) => {
    const response = await apiService.post("/customers/confirmed", data);
    return response.data;
  },
  customerPaymentExport: async (id) => {
    const response = await apiService.get(`/customers/${id}/report`);
    return response.data;
  },
  detail: async (id) => {
    const response = await apiService.get(`/customers/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/customers/${id}`);
    return response.data;
  },
  update: async (id, updatedData) => {
    try {
      const response = await apiService.put(`/customers/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },

  register: async (data) => {
    console.log("🚀 ~ register: ~ data:", data);
    const response = await apiService.post(`/customers/signup`, data);
    return response.data;
  },
};

export default FertilityServices;
