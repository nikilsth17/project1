import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const ImportReasonService = {
  // Define your API functions here
  getList: async () => {
    const response = await apiService.get("/import-reason");
    return response.data;
  },
  create: async (postData) => {
    const response = await apiService.post("/import-reason", postData);
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get(`/import-reason/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/import-reason/${id}`);
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await apiService.put(`/import-reason/${id}`, updatedData);
    return response.data;
  },
};

export default ImportReasonService;
