import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const QuickBookServices = {
  // Define your API functions here
  createCard: async ({ QBOCustomerId, creditData }) => {
    const response = await apiService.post(
      `/quickbook/${QBOCustomerId}/create-card  `,
      creditData
    );
    return response.data;
  },
  recreateQuickBook: async (id) => {
    const response = await apiService.post(`/quickbook/${id}/recreate-account`);
    return response.data;
  },
  createCharges: async (quickBookData) => {
    const response = await apiService.post(
      `/quickbook/create-charges`,
      quickBookData
    );
    return response.data;
  },
  recreateInvoice: async (id) => {
    const response = await apiService.post(`/quickbook/${id}/recreate-invoice`);
    return response;
  },

  addBankAccount: async ({ id, bankData }) => {
    const response = await apiService.post(
      `/quickbook/${id}/createbankacc`,
      bankData
    );
    return response;
  },

  getCards: async (id) => {
    const response = await apiService.get(`/quickbook/${id}/card`);
    return response.data;
  },

  getBankAccounts: async (id) => {
    const response = await apiService.get(`/quickbook/${id}/bankaccount`);
    return response.data;
  },

  deleteCards: async ({ id, cardId }) => {
    const response = await apiService.delete(
      `/quickbook/${id}/delete-card?cardId=${cardId}`
    );
    return response;
  },
  deleteBankAccount: async ({ id, bankAccId }) => {
    const response = await apiService.delete(
      `/quickbook/${id}/delete-bankacc?bankAccId=${bankAccId}`
    );
    return response;
  },
  createCharge: async ({ invoiceId, cardId }) => {
    const response = await apiService.post(
      `/quickbook/${invoiceId}/create-charges/${cardId}`
    );
    return response;
  },
  downloadPDF: async ({ id }) => {
    const response = await apiService.get(
      `/accountingService/${id}/getinvoiceaspdf`
    );
    // const response = await apiService.get(
    //   `/invoicepdf/private/invoices/${id}.pdf`
    // );

    return response;
  },
};

export default QuickBookServices;
