import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const ShipmentServices = {
  // Define your API functions here
  cancelShipment: async (id, data) => {
    const response = await apiService.delete(`/shipment/${id}`, data);
    return response.data;
  },
  cancelAdminShipment: async (id, data) => {
    const response = await apiService.delete(
      `shipment/${id}/deleteadminlabel?reason=${data?.reason}`
    );
    return response.data;
  },
  updateShipment: async (id, data) => {
    console.log("🚀 ~ updateShipment: ~ data:", data);
    const response = await apiService.patch(`/shipment/${id}/update`, data);
    return response.data;
  },
};

export default ShipmentServices;
