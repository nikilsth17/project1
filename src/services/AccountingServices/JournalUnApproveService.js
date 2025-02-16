import _BaseAPIService from "../_BaseAPIService";

const instance = _BaseAPIService.instance;

const JournaUnApproveService = {
  updateIncomeUnApprove: async (id, updatedData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.patch(
        `/IncomeVoucher/UnApprove/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateExpensesUnApprove: async (id, updatedData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.patch(
        `/ExpenseVoucher/UnApprove/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateJournalUnApprove: async (id, updatedData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.patch(
        `/JournalVoucher/UnApprove/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default JournaUnApproveService;
