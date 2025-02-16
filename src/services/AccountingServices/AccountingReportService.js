import _BaseAPIService from "../_BaseAPIService";

const instance = _BaseAPIService.instance;

const AccountingService = {
  // Define your API functions here
  LedgerStatement: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.get("/LedgerStatement?LedgerID=" + id);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  TrialBalance: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.get(
        "/AccountReporting/GetTrialBalanceList"
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  BalanceSheet: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.get(
        "/AccountReporting/GetBalanceSheetList"
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  ProfitLoss: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.get("/AccountReporting/GetPLSheetList");
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
export default AccountingService;
