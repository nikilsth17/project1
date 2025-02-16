import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const OneWorldServices = {
  // Define your API functions here
  getList: async () => {
    const response = await apiService.get("/service");
    return response.data;
  },
  generalService: async () => {
    const response = await apiService.get("/serviceprovider/service-provider");
    return response.data;
  },
  create: async (postData) => {
    const response = await apiService.post("/service", postData);
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get(`/service/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/service/${id}`);
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await apiService.put(`/service/${id}`, updatedData);
    return response.data;
  },
  updateService: async (updatedData) => {
    const response = await apiService.patch(
      `/general/service-provider`,
      updatedData
    );
    return response.data;
  },
};

export default OneWorldServices;
