import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const PackageTypeServices = {
  // Define your API functions here
  getList: async () => {
    const response = await apiService.get("/package-type");
    return response.data;
  },
  create: async (postData) => {
    const response = await apiService.post("/package-type", postData);
    return response.data;
  },
  packagelist: async () => {
    const response = await apiService.get(`/items/ispackage?isPackage=${true}`);
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get(`/package-type/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/package-type/${id}`);
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await apiService.put(`/package-type/${id}`, updatedData);
    return response.data;
  },
};

export default PackageTypeServices;
