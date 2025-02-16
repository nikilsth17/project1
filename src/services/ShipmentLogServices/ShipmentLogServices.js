import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const ShipmentLogServices = {
  // Define your API functions here

  getShipmentLog: async ({ shipmentId }) => {
    const response = await apiService.get(
      `/shipmentlog/shipment/${shipmentId}`
    );
    return response.data;
  },
};

export default ShipmentLogServices;
