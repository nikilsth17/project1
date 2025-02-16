import _BaseAPIService from "../_BaseAPIService";

const instance = _BaseAPIService.instance;

const JournalApproveService = {
  updateIncomeApprove: async (id, updatedData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.patch(
        `/IncomeVoucher/Approve/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateIncomeReject: async (id, updatedData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.patch(
        `/IncomeVoucher/Reject/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateExpensesApprove: async (id, updatedData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.patch(
        `/ExpenseVoucher/Approve/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateExpensesReject: async (id, updatedData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.patch(
        `/ExpenseVoucher/Reject/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateJournalApprove: async (id, updatedData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.patch(
        `/JournalVoucher/Approve/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateJournalReject: async (id, updatedData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.patch(
        `/JournalVoucher/Reject/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default JournalApproveService;
