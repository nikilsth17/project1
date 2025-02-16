
import _BaseAPIService from '../../_BaseAPIService';

const apiService = _BaseAPIService.instance;

const GeneralServices = {
  // Define your API functions here
  getAddressType: async () => {
    const response = await apiService.get('/general/address-type');
    return response.data;
  },
  getItemType: async () => {
    const response = await apiService.get('/general/item-types');
    return response.data;
  },
  getCountriesType: async () => {
    const response = await apiService.get('/general/countries');
    return response.data;
  },
  getHearAboutSource: async () => {
    const response = await apiService.get('/general/hear-about-source');
    return response.data;
  },
  //   getServiceProvider: async () => {
  //     const response = await apiService.get('/general/service-provider');
  //     return response.data;
  //   },
  getInternationalServiceProvider: async () => {
    const response = await apiService.get('/general/international-service-provider');
    return response.data;
  },
  getDomesticServiceProvider: async () => {
    const response = await apiService.get('/general/domestic-service-provider');
    return response.data;
  },
  getShipmentStatus: async () => {
    const response = await apiService.get('/general/shipment-status');
    return response.data;
  },
  getPrinterOption: async () => {
    const response = await apiService.get('/general/printer-option');
    return response.data;
  },
  getPaperworkNotificationList: async () => {
    const response = await apiService.get('/general/paperwork-notification-list');
    return response.data;
  },
  getNotificationReceiver: async () => {
    const response = await apiService.get('/general/notification-receiver');
    return response.data;
  },


  // getListDelivery: async () => {
  //   const response = await apiService.get('/delivery-instruction');
  //   return response.data;
  // },

  // getListPickup: async () => {
  //   const response = await apiService.get('/pickup-instruction');
  //   return response.data;
  // },

};

export default GeneralServices







