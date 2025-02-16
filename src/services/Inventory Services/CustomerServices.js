import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const CustomerServices = {
  // Define your API functions here
  getList: async () => {
    const response = await apiService.get("/Customers/GetList");
    return response.data;
  },
  getCustomerList: async () => {
    const response = await apiService.get("/customer/customerlist");
    return response.data;
  },
  create: async (postData) => {
    const response = await apiService.post("/Customers/Create", postData);
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get("/Customers/GetDetail?id=" + id);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete("/Customers/Delete?id=" + id);
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await apiService.patch(
      `/Customers/Update?id=` + id,
      updatedData
    );
    return response.data;
  },
};

export default CustomerServices;
