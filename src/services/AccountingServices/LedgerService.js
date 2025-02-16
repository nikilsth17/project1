import _BaseAPIService from "../_BaseAPIService";

const instance = _BaseAPIService.instance;

const LedgersService = {
  // Define your API functions here
  getList: async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.get("/Ledger/GetList");
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (postData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      // Your Bearer token (replace with your actual token)

      const response = await instance.post("/Ledger/Create", postData);
      console.log("response: ", response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      console.log("error");
      const response = await instance.delete(`/Ledger/Delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, updatedData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.put(`/Ledger/Update/${id}`, updatedData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
export default LedgersService;
