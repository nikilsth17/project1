import _BaseAPIService from "../_BaseAPIService";

const instance = _BaseAPIService.instance;

const EmployeeSettlementService = {
  //Employee getlist ko lagi
  getList: async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.get("/Settlement/GetList");
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (postData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.post("/Settlement/Create", postData);
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
      const response = await instance.delete(`/Settlement/Delete?id=` + id);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  view: async (id) => {
    console.log(id);
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.get(`/Settlement/GetDetail?id=` + id);
      console.log("view data ", id, JSON.stringify(response));
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (id, updatedData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.patch(
        `/Settlement/Update?id=` + id,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default EmployeeSettlementService;
