import _BaseAPIService from "../_BaseAPIService";

const instance = _BaseAPIService.instance;
const ApprovedVoucherListService = {
  // Define your API functions here
  getList: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.get("/JournalVoucher/GetApprovedList");
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // for income approved
  IncomegetList: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.get("/IncomeVoucher/GetApprovedList");
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  //approved Expense Vouchers
  ExpensegetList: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      // Your Bearer token (replace with your actual token)

      //header ko value kata insert garyou axios ma??

      //const response = await apiService.get('/AccountingReports/LedgerStatement?id=' + id);
      const response = await instance.get("/ExpenseVoucher/GetApprovedList");
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
export default ApprovedVoucherListService;
