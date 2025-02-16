import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const PaymentService = {
  getList: async (driverId) => {
    const response = await apiService.get("/payments", {
      params: {
        driver: driverId,
      },
    });
    return response.data;
  },
  getBookingList: async (id, driverId) => {
    const response = await apiService.get(`/customers/${id}/all-bookings`, {
      params: {
        driver: driverId,
      },
    });
    return response.data;
  },
  getPaidList: async (driverId) => {
    const response = await apiService.get("/payments/paid", {
      params: {
        driver: driverId,
      },
    });
    return response.data;
  },

  getFiltered: async (customerId, driverId) => {
    const response = await apiService.get("/payments", {
      params: {
        customer_id: customerId,
        driver: driverId,
      },
    });
    return response.data;
  },
  getListFiltered: async (startDate, endDate, customerId, driverId) => {
    const response = await apiService.get("/payments", {
      params: {
        start_date: startDate,
        end_date: endDate,
        customer_id: customerId,
        driver: driverId,
      },
    });
    return response.data;
  },

  getPaymentFiltered: async (driverId, customerId) => {
    const response = await apiService.get("/payments", {
      params: {
        customer_id: customerId,
        driver: driverId,
      },
    });
    return response.data;
  },
  getPaymentListFiltered: async (startDate, endDate, driverId, customerId) => {
    const response = await apiService.get("/payments", {
      params: {
        start_date: startDate,
        end_date: endDate,
        customer_id: customerId,
        driver: driverId,
      },
    });
    return response.data;
  },
  getPaidListFiltered: async (params = {}) => {
    const response = await apiService.get("/payments/paid", {
      params: {
        driver: driverId,
      },
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/payments/${id}`);
    return response.data;
  },
  getByCustomerId: async (id) => {
    const response = await apiService.get(`/payments?customer_id=${id}`);
    return response.data;
  },
};

export default PaymentService;
