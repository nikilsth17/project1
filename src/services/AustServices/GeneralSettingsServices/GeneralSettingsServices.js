import _BaseAPIService from "../../_BaseAPIService";
const apiService = _BaseAPIService.instance;

const GeneralSettingServices = {
  // Define your API functions here
  getList: async () => {
    const response = await apiService.get("/configuration/general-setting");
    return response.data;
  },
  update: async (updatedData) => {
    const response = await apiService.patch(
      `/configuration/general-setting`,
      updatedData
    );
    return response.data;
  },
};

export default GeneralSettingServices;
