import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const ManifestServices = {
  // Define your API functions here
  createManifest: async (data) => {
    const response = await apiService.put(`/manifest`, data);
    return response.data;
  },
  getManifestList: async ({ Date }) => {
    const filterList = [];

    if (Date) filterList.push(`Date=${Date}`);
    let filterString = filterList.join("&");
    const response = await apiService.get(`/manifest?${filterString}`);
    return response.data;
  },
  getManifestById: async (id) => {
    const response = await apiService.get(`/manifest/${id}`);
    return response.data;
  },
};

export default ManifestServices;
