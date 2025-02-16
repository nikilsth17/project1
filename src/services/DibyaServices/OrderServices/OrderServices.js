import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const OrderServices = {
  // Define your API functions here
  get: async () => {
    const response = await apiService.get("/order");
    return response.data;
  },
  getDelivery: async ({ DeliveryDateFrom, DeliveryDateTo }) => {
    const filterList = [];

    if (DeliveryDateFrom)
      filterList.push(`DeliveryDateFrom=${DeliveryDateFrom}`);
    if (DeliveryDateTo) filterList.push(`DeliveryDateTo=${DeliveryDateTo}`);

    let filterString = filterList.join("&");

    try {
      const response = await apiService.get(`/orderv1?${filterString}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Order list:", error);
      throw error;
    }
  },
  getPendingOrder: async () => {
    const response = await apiService.get("/admindashboard/pendingorderscount");
    return response.data;
  },
  getOrder: async () => {
    const response = await apiService.get("/orderv1");
    return response.data;
  },
  getViewOrder: async (id) => {
    const response = await apiService.get(`/orderdetailv1/orderdetail/${id}`);
    return response.data;
  },

  viewItem: async (id) => {
    const response = await apiService.get(`/items/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`/order/${id}`);
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get(`/customer/withorderdetail/${id}`);
    return response.data;
  },
  getItemOrderDetail: async (id) => {
    const response = await apiService.get(`/orderdetailv1`);
    return response.data;
  },

  updateOrder: async (id, status, updatedData) => {
    try {
      const response = await apiService.put(
        `/orderv1/statusupdate/${id}?status=${status}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },

  update: async (id, updatedData) => {
    try {
      const response = await apiService.put(`/items/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating ratecard:", error);
      throw error;
    }
  },

  updateOnClick: async (id) => {
    try {
      const response = await apiService.put(`/orderv1/update-onclick/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error updating on click:", error);
      throw error;
    }
  },

  updatePaymentStatus: async (orderId) => {
    try {
      const response = await apiService.put(
        `/paymentdetail/update-paymentstatus?orderId=${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  },

  getPackageContents: async (packageId, orderId) => {
    const response = await apiService.get(`/orderchild/customer?packageId=${packageId}&orderId=${orderId}`);
    return response.data;
  }
};

export default OrderServices;
