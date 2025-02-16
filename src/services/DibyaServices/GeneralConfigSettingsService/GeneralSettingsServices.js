import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const GeneralSettingsServices = {
  list: async () => {
    try {
      const response = await apiService.get('http://api.dibyasweets.sebs.asia/api/configuration');
      return response.data;
    } catch (error) {
      console.error("Error fetching configurations:", error);
      throw error;
    }
  },

  update: async (id, updatedData) => {
    try {
      let response;
      try {
        response = await apiService.put(`http://api.dibyasweets.sebs.asia/api/configuration`, updatedData);
      } catch (error) {
        if (error.response && error.response.status === 405) {
          response = await apiService.patch(`http://api.dibyasweets.sebs.asia/api/configuration/`, updatedData);
        } else {
          throw error;
        }
      }
      return response.data;
    } catch (error) {
      console.error("Error updating configuration:", error);
      throw error;
    }
  },
};

export default GeneralSettingsServices;
