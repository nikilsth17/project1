import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const ItemServices = {
  // Define your API functions here
  itemList: async () => {
    const response = await apiService.get("/items");
    return response.data;
  },
  List: async (id) => {
    const response = await apiService.get(
      `/orderdetailv1/customeritem?customerId=${id}&isCustomer=true`
    );
    return response.data;
  },

  list: async () => {
    const response = await apiService.get(
      `/items/ispackage?isPackage=${false}`
    );
    return response.data;
  },

  viewItem: async (id) => {
    const response = await apiService.get(`/items/${id}`);
    return response.data;
  },
  deleteItem: async (id) => {
    const response = await apiService.delete(`/items/${id}`);
    return response.data;
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
};

export default ItemServices;
