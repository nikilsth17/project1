import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const SalesServices = {
  // Define your API functions here
  getList: async () => {
    const response = await apiService.get("/Sales/GetList");
    return response.data;
  },
  create: async (postData) => {
    const response = await apiService.post("/Sales/Create", postData);
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get("/Sales/GetDetail?id=" + id);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete("/Sales/Delete?id=" + id);
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await apiService.patch(
      `/Sales/Update?id=` + id,
      updatedData
    );
    return response.data;
  },
  createBulkSales: async (postData) => {
    const response = await apiService.post("/Sales", postData);
    return response.data;
  },
};

export default SalesServices;
