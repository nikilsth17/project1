import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const PickupService = {
  pickUp: async (data) => {
    // const response = await apiService.get("/client/pickup-locations", data);
    const payload = { address: data };
    // const response = await apiService.post("/search-locations", payload);
    const response = await apiService.post("/search-address", payload);
    return response.data;
  },
  addressDetail: async (id) => {
    console.log("🚀 ~ addressDetail: ~ id:", id);

    const response = await apiService.post(`/search-address/${id}`, id);
    return response.data;
    console.log("🚀 ~ addressDetail: ~ response:", response);
  },
};

export default PickupService;
