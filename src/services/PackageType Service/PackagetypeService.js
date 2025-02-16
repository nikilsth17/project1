import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const PaymenttypeService = {
    getList: async () => {
        const response = await apiService.get("/payment-types");
        return response.data;
      },

  update: async (id,data) => {
    try {
      const response = await apiService.put(`/payment-types/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },
};

export default PaymenttypeService;
