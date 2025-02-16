import _BaseAPIService from "../_BaseAPIService";

const instance = _BaseAPIService.instance;

const UnApprovedVoucherListService = {
  // Define your API functions here
  getList: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.get("/JournalVoucher/GetUnApprovedList");
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getVoucherLog: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.get(`/VoucherLog/GetVoucherLog/${id}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  //For income unapprove
  IncomegetList: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.get("/IncomeVoucher/GetUnApprovedList");
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  //For expenses unapprove
  ExpensegetList: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.get("/ExpenseVoucher/GetUnApprovedList");
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
export default UnApprovedVoucherListService;
