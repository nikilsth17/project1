import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const PaymentService = {

  update: async (updatedData) => {
    try {
      const response = await apiService.patch("/payment/update-status", updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },
};

export default PaymentService;
