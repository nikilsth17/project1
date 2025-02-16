import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const CurrencyServices = {
  // Define your API functions here
  // getList: async () => {
  //   const response = await apiService.get('/configuration');
  //   return response.data;
  // },

  create: async (postData) => {
    const response = await apiService.post("/currency", postData);
    return response.data;
  },

  view: async (id) => {
    const response = await apiService.get(`/currency/${id}`);
    return response.data;
  },
  ConfigureUpdate: async (id, updatedData) => {
    const response = await apiService.put("/configuration", updatedData);
    return response.data;
  },
  getList: async () => {
    const response = await apiService.get("/currency");
    return response.data;
  },

  delete: async (id) => {
    const response = await apiService.delete(`/currency/${id}`);
    return response.data;
  },

  updatecurrency: async (id, updatedData) => {
    const response = await apiService.put(`/currency/${id}`, updatedData);
    return response.data;
  },

  getCurrencyList: async () => {
    const response = await apiService.get("/currency");
    console.log("🚀 ~ getCurrencyList: ~ response:", response);
    return response.data;
  },
};

export default CurrencyServices;
