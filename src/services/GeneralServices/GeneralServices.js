import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const GeneralServices = {
  // Define your API functions here
  getCountryList: async () => {
    const response = await apiService.get("/general/countries");
    return response.data;
  },
  getShipmentStatus: async () => {
    const response = await apiService.get("/general/shipment-status");
    return response.data;
  },
};

export default GeneralServices;
