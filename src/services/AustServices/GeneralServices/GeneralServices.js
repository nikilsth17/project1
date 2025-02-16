import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const GeneralServices = {
  // Define your API functions here
  getCountries: async () => {
    const response = await apiService.get("/general/countries");
    return response.data;
  },
  hearAboutSource: async () => {
    const response = await apiService.get("/general/hear-about-source");
    return response.data;
  },
  postAddressBook: async (addressBookData) => {
    const response = await apiService.post(
      "/general/address-book",
      addressBookData
    );
    return response.data;
  },
  getAddressBook: async () => {
    const response = await apiService.get("/general/address-book");
    return response.data;
  },
  getAddressType: async () => {
    const response = await apiService.get("/general/address-type");
    return response.data;
  },
  getServiceProvider: async () => {
    const response = await apiService.get("/general/service-provider");
    return response.data;
  },

  postalCodeSearch: async ({ query, countryId }) => {
    const response = await apiService.get(
      `/general/postal-code?query=${query}&countryId=${countryId}`
    );
    return response.data;
  },
};

export default GeneralServices;
